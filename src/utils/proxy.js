const standardSettings = require('standard-settings')
const querystring = require('querystring')
const omit = require('lodash.omit')
const request = require('request')
const winston = require('winston')
const fs = require('fs')

const settings = standardSettings.getSettings()

class Proxy {
  async post (body, fromQueue) {
    console.log(`proxy.js | post from proxy ${fromQueue ? ' -- queue' : ''}`)

    const url = body.url || settings.targetUrl

    body.timeStamp = body.timeStamp || new Date().getTime()

    if (settings.flag.devMode) {
      body = {
        url,
        type: 'POST',
        reason: 'dev'
      }
    } else {
      body.url = url
    }

    try {
      return await this.launchRequest(body, fromQueue)
    } catch (err) {
      winston.error('proxy.js | post: fail')
    }
  }

  launchRequest (body, fromQueue) {
    return new Promise((resolve, reject) => {
      winston.info('proxy.js | launchRequest', body.url)

      body.formData = body.formData || querystring.parse(body.data)

      if (!Object.keys(body.formData).length) {
        body.formData = omit(body, 'url')
      }

      const options = {}

      if (!Array.isArray(body.files) || !body.files.length) {
        options.form = body.formData
      }

      const req = request.post(body.url, options, (error, res, body) => {
        if (!error && res && res.statusCode === 200) {
          if (fromQueue) {
            winston.info('proxy.js | launchRequest: success (from queue)')

            // Delete from queue
            resolve()
          } else {
            winston.info('proxy.js | launchRequest: success')

            // Post success
            resolve()
          }
        } else {
          winston.info('proxy.js | launchRequest: fail')

          // Post fail
          reject()
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
