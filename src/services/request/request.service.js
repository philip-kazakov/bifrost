const createService = require('feathers-sequelize')
const multer = require('multer')
const path = require('path')
const settings = require('standard-settings')

const createModel = require('../../models/request.model')
const hooks = require('./request.hooks')

const upload = multer({
  dest: path.normalize(path.join(__dirname, settings.get('folder:uploads')))
})

module.exports = function (app) {
  const Model = createModel(app)

  const options = {
    name: 'request',
    Model
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
