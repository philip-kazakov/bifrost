const request = require('./request/request.service.js')

const timer = require('./timer/timer.service.js')

module.exports = function (app) {
  app.configure(request)
  app.configure(timer)
}
