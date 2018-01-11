const path = require('path')
const standardSettings = require('standard-settings')
const multer = require('multer')

const settings = standardSettings.getSettings()
const upload = multer({
  dest: path.join(__dirname, settings.folder.uploads)
})

module.exports = app => {
  class MainService {
    async create() {
      return 'OK'
    }
  }

  app.use('/main', upload.any(), new MainService())
}
