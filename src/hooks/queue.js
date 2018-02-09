// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const async = require('async')
const logger = require('./../logger')
const fs = require('fs')
const fetch = require('node-fetch')
const settings = require('standard-settings')
const FormData = require('form-data')

const maxQueue = settings.get('maxQueue') || 5

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    if (context.result && context.result.isHook) {
      context.result = context.result.data
    } else {
      context.result = {
        proxy: 'saved'
      }

      const handler = async () => {
        const requests = await context.app.service('request').find({
          query: {
            status: 'pending'
          }
        })
        const requestQueue = async.queue(async (request, cb) => {
          try {
            const res = await makeRequest(request)

            if (res && (res.status >= 200 && res.status < 300)) {
              await context.app.service('request').patch(request.id, {
                status: 'done'
              })

              cb()
            } else {
              throw new Error('No response')
            }
          } catch (err) {
            logger.error(err)

            context.app.service('request').patch(request.id, {
              retriesCount: request.retriesCount + 1
            })

            cb(err)
          }
        }, 3)

        requestQueue.drain = () => {
          logger.info('All requests have been processed')
          console.log('All requests have been processed')
        }

        if (Array.isArray(requests) && requests.length) {
          context.app.service('timer').create({ handler })
        } else {
          context.app.service('timer').remove(0)
        }

        requests.forEach(request => {
          request.files = JSON.parse(request.files)
          request.formData = JSON.parse(request.formData)

          requestQueue.push(request, err => {
            if (err) {
              logger.error(err)
            }
          })
        })
      }

      context.app.service('timer').create({ handler })
    }

    return context
  }
}

function makeRequest (data) {
  const form = new FormData()

  for (let key in data.formData) {
    form.append(key, data.formData[key])
  }

  if (Array.isArray(data.files) && data.files.length) {
    data.files.forEach(file => {
      form.append(file.fieldname, fs.createReadStream(file.path), {
        filename: file.originalname
      })
    })
  }

  return fetch(data.url, {
    method: 'POST',
    body: form,
    timeout: 10000
  })
}
