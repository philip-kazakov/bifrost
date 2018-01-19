const request = require('./request/request.service.js')

module.exports = function (app) {
  app.configure(request)
}
