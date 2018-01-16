const winston = require('winston')
const asyncQueue = require('async/queue')
const asyncSetImmediate = require('async/setImmediate')
const standardSettings = require('standard-settings')

const { Request } = require('./../models')
const proxy = require('./proxy')
const timer = require('./timer')

const settings = standardSettings.getSettings()

const requestQueue = asyncQueue((task, cb) => {
  asyncSetImmediate(() => {
    cb()
  })
})

requestQueue.drain = () => {
  winston.info('queue.js | All requests were processed')
}

class Queue {
  async saveRequest (body) {
    let result = {}

    body.timeStamp = body.timeStamp || Date.now()

    try {
      await Request.create({
        timestamp: body.timeStamp,
        body
      })

      if (settings.flag.autostart) {
        timer.start()
      }

      result = {
        proxy: 'saved'
      }
    } catch (err) {
      winston.error('queue.js | saveRequest fail:', err, 'args:', body)

      result = { err }
    }

    return result
  }

  async handle () {
    try {
      const requestList = await Request.findAll()

      if (Array.isArray(requestList) && requestList.length) {
        if (settings.flag.autostart) {
          timer.start()
        }

        requestList.forEach(request => {
          requestQueue.push(request, err => {
            if (err) throw err
          })

          proxy
            .post(request.body, true)
            .catch(err => {
              winston.error('queue.js | proxy.post: fail', err)
            })
        })
      } else {
        timer.clear()
      }
    } catch (err) {
      winston.error('queue.js | handle fail:', err)
    }
  }

  removeRequest (timestamp) {
    Request
      .destroy({
        where: { timestamp }
      })
      .catch(err => {
        winston.error('queue.js | removeRequest:', err)
      })
  }

  async totalCount () {
    try {
      // TODO: Count
    } catch (err) {
      winston.error('queue.js | totalCount:', err)
    }
  }
}

module.exports = new Queue()
