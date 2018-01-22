const winston = require('winston')

module.exports = function () {
  return function copyOrigin (req, res, next) {
    winston.info('copyOrigin middleware is running')

    req.origin = req.headers.origin

    next()
  }
}
