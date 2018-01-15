const path = require('path')
const standardSettings = require('standard-settings')
const multer = require('multer')

const settings = standardSettings.getSettings()
const upload = multer({
  dest: path.join(__dirname, settings.folder.uploads)
})

module.exports = app => {
  class MainService {
    async create (data) {
      console.dir(data)

      return 'OK'
    }
  }

  app.use('/main', upload.any(), (req, res, next) => {
    if (Array.isArray(req.files) && req.files.length) {
      req.body.files = []

      req.files.forEach(({ path, fieldname, originalname }) => {
        req.body.files.push({
          path,
          fieldname,
          originalname
        })
      })
    }

    req.body.origin = req.headers.origin

    next()
  }, new MainService())
}
