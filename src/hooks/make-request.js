// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const fetch = require('node-fetch')
const omit = require('lodash.omit')
const logger = require('winston')

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    if (!context.data.formData) {
      context.data.formData = context.params.query.data
    }

    if (!Object.keys(context.data.formData)) {
      context.data.formData = omit(context.data, 'url')
    }

    try {
      const res = await fetch(context.data.url, {
        method: 'POST',
        body: JSON.stringify(context.data.formData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      context.result = await res.json()
    } catch (err) {
      logger.info(err)
    }

    return context
  }
}
