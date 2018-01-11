const Main = require('./Main')

module.exports = app => {
  app.use('/main', new Main())
}
