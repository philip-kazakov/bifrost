const standardSettings = require('standard-settings')
const winston = require('winston')
const multer = require('multer')
const path = require('path')

const proxy = require('./../../utils/proxy')
const queue = require('./../../utils/queue')
const timer = require('./../../utils/timer')

const settings = standardSettings.getSettings()
const upload = multer({
  dest: path.join(__dirname, settings.folder.uploads)
})

module.exports = app => {
  class MainService {
    constructor () {
      this.pendingRequests = []
    }

    async create (data) {
      winston.info('main.service.js | create:', data)

      try {
        const result = await proxy.post(data)

        if (result.failed) {
          this.pendingRequests.push({
            origin: result.body.origin,
            timestamp: result.body.timeStamp,
            reason: result.body.reason,
            status: result.res ? result.res.statusCode : 'Server not found'
          })

          if (result.fromQueue) {
            if (settings.flag.autostart) {
              timer.start()
            }
          } else {
            try {
              return await queue.saveRequest(result.body)
            } catch (err) {
              winston.error(err)
            }
          }
        } else if (result.deleteFromQueue) {
          queue.removeRequest(result.timeStamp)
        } else {
          return result.body
        }
      } catch (err) {
        winston.error(err)

        return { err }
      }
    }
  }

  app.use('/main', upload.any(), (req, res, next) => {
    // Check if request is 'POST'
    if (req.body.type && req.body.type !== 'POST') {
      res
        .status(500)
        .json({
          error: 'Type not supported. Bifrost only handle POST requests'
        })
    }

    next()
  }, (req, res, next) => {
    if (Array.isArray(req.files) && req.files.length) {
      req.body.files = []

      req.files.forEach(({ path, fieldname, originalname }) => {
        req.body.files.push({
          path,
          fieldname,
          originalname
        })
      })
    }

    req.body.origin = req.headers.origin

    next()
  }, new MainService())
}
