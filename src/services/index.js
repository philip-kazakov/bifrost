const Main = require('./main/main.service')

module.exports = app => {
  app.configure(Main)
}
