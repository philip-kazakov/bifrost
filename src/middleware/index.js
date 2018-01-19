const copyOrigin = require('./copy-origin')

module.exports = function (app) {
  app.use('/request', copyOrigin())
}
