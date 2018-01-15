const winston = require('winston')
const asyncQueue = require('async/queue')
const asyncSetImmediate = require('async/setImmediate')

const { Request } = require('./../models')
const proxy = require('./proxy')

const requestQueue = asyncQueue((task, cb) => {
  asyncSetImmediate(() => {
    cb()
  })
})

requestQueue.drain = () => {
  winston.info('queue.js | All requests were processed')
}

class Queue {
  async saveRequst (body) {
    body.timeStamp = body.timeStamp || Date.now()

    try {
      await Request.create({
        timeStamp: body.timeStamp,
        body
      })

      return {
        proxy: 'saved'
      }
    } catch (err) {
      winston.error('queue.js | saveRequest fail:', err, 'args:', body)
    }
  }

  async handle () {
    try {
      const requestList = await Request.findAll()

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
    } catch (err) {
      winston.error('queue.js | handle fail:', err)
    }
  }

  async removeRequest (timeStamp) {
    try {
      await Request.destroy({
        where: { timeStamp }
      })
    } catch (err) {
      winston.error('queue.js | removeRequest:', err)
    }
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
