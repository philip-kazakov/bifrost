const createService = require('feathers-sequelize')
const multer = require('multer')
const path = require('path')

const createModel = require('../../models/request.model')
const hooks = require('./request.hooks')

const upload = multer({
  dest: path.join(__dirname, '..', '..', '..', 'uploads')
})

module.exports = function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    name: 'request',
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/request', upload.any(), (req, res, next) => {
    if (Array.isArray(req.files) && req.files.length) {
      req.feathers.files = req.files.map(file => ({
        path: file.path,
        fieldname: file.fieldname,
        originalname: file.originalname
      }))
    }

    next()
  }, createService(options))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('request')

  service.hooks(hooks)
}
