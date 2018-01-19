const standardSettings = require('standard-settings')
const querystring = require('querystring')
const omit = require('lodash.omit')
const request = require('request')
const winston = require('winston')
const fs = require('fs')

const settings = standardSettings.getSettings()

class Proxy {
  async post (body, fromQueue = false) {
    winston.info(`proxy.js | post from proxy ${fromQueue ? ' -- queue' : ''}`)

    body.timeStamp = body.timeStamp || new Date().getTime()

    if (settings.flag.devMode) {
      body = {
        url: body.url,
        type: 'POST',
        reason: 'dev'
      }
    }

    try {
      return await this.launchRequest(body, fromQueue)
    } catch (err) {
      winston.error('proxy.js | post: fail')
    }
  }

  launchRequest (body, fromQueue) {
    return new Promise(resolve => {
      winston.info('proxy.js | launchRequest', body.url)

      body.formData = body.formData || querystring.parse(body.data)

      if (!Object.keys(body.formData).length) {
        body.formData = omit(body, 'url')
      }

      const options = {}

      if (!Array.isArray(body.files) ||
        (Array.isArray(body.files) && !body.files.length)) {
        options.form = body.formData
      }

      const req = request.post(body.url, options, (error, res, resBody) => {
        if (!error && res && res.statusCode === 200) {
          if (fromQueue) {
            winston.info('proxy.js | launchRequest: success (from queue)')

            resolve({
              deleteFromQueue: true,
              timeStamp: body.timeStamp
            })
          } else {
            winston.info('proxy.js | launchRequest: success')

            resolve({
              body: resBody
            })
          }
        } else {
          winston.info('proxy.js | launchRequest: fail')

          resolve({
            res,
            body,
            fromQueue,
            failed: true
          })
        }
      })

      if (Array.isArray(body.files) && body.files.length) {
        const form = req.form()

        body.files.forEach(file => {
          form.append(file.fieldName, fs.createReadStream(file.path), {
            filename: file.originalname
          })
        })
      }
    })
  }
}

module.exports = new Proxy()
