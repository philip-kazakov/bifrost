const standardSettings = require('standard-settings')
const winston = require('winston')
const multer = require('multer')
const path = require('path')

const proxy = require('./../../utils/proxy')

const settings = standardSettings.getSettings()
const upload = multer({
  dest: path.join(__dirname, settings.folder.uploads)
})

module.exports = app => {
  class MainService {
    async create (data) {
      winston.info('main.service.js | create:', data)

      try {
        await proxy.post(data)
      } catch (err) {
        winston.error(err)
      }

      return 'OK'
    }
  }

  app.use('/main', upload.any(), (req, res, next) => {
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
