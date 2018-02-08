// A hook that logs service method before, after and error
const logger = require('./../logger')

module.exports = function () {
  return context => {
    // This debugs the service call and a stringified version of the hook context
    // You can customize the message (and logger) to your needs
    logger.debug(`${context.type} app.service('${context.path}').${context.method}()`)

    if (typeof context.toJSON === 'function') {
      logger.debug('Hook Context', JSON.stringify(context, null, '  '))
    }

    if (context.error) {
      logger.error(context.error)
    }
  }
}
