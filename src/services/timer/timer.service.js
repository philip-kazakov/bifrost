// Initializes the `timer` service on path `/timer`
const createService = require('./timer.class.js')
const hooks = require('./timer.hooks')

module.exports = function (app) {
  const paginate = app.get('paginate')

  const options = {
    name: 'timer',
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/timer', createService(options))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('timer')

  service.hooks(hooks)
}
