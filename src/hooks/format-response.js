// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const async = require('async')
const logger = require('winston')

const requestQueue = async.queue((_, cb) => {
  async.setImmediate(() => {
    cb()
  })
}, 1)

requestQueue.drain = () => {
  logger.info('All requests have been processed')
}

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    if (context.result && context.result.isHook) {
      context.result = context.result.data
    } else {
      context.result = {
        proxy: 'saved'
      }

      const handle = async () => {
        const requests = await context.app.service('request').find()

        if (Array.isArray(requests) && requests.length) {
          await context.app.service('timer').create(handle)
        } else {
          await context.app.service('timer').remove()
        }

        requests.forEach(request => {
          requestQueue.push(request, err => {
            if (err) {
              throw err
            }
          })

          // TODO: Make POST
        })
      }

      await context.app.service('timer').create(handle)
    }

    return context
  }
}
