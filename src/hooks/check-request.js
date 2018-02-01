// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const fetch = require('node-fetch')
const omit = require('lodash.omit')
const logger = require('winston')
const FormData = require('form-data')
const fs = require('fs')

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    const form = new FormData()

    if (!context.data.formData) {
      context.data.formData = context.params.query.data
    }

    if (!context.data.formData ||
      Object.keys(context.data.formData).length < 1) {
      context.data.formData = omit(context.data, 'url')
    }

    for (let key in context.data.formData) {
      form.append(key, context.data.formData[key])
    }

    if (Array.isArray(context.params.files) && context.params.files.length) {
      context.params.files.forEach(file => {
        form.append(file.fieldname, fs.createReadStream(file.path), {
          filename: file.originalname
        })
      })
    }

    try {
      const res = await fetch(context.data.url, {
        method: 'POST',
        body: form
      })

      context.result = {
        isHook: true,
        data: await res.json()
      }
    } catch (err) {
      logger.info(err)
    }

    return context
  }
}
