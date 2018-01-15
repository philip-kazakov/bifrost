const winston = require('winston')

// To see more detailed messages, uncomment the following line
// winston.level = 'debug'

module.exports = () => context => {
  winston.debug(`${context.type} app.service('${context.path}').${context.method}()`)

  if (typeof context.toJSON === 'function') {
    winston.debug('Hook Context', JSON.stringify(context, null, '  '))
  }

  if (context.error) {
    winston.error(context.error)
  }
}
