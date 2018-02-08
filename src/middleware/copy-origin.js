const logger = require('./../logger')

module.exports = function () {
  return function copyOrigin (req, res, next) {
    logger.info('copyOrigin middleware is running')

    req.feathers.origin = req.headers.origin

    next()
  }
}
