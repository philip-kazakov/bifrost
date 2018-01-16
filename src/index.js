const logger = require('winston')
const standardSettings = require('standard-settings')

const app = require('./app')

const settings = standardSettings.getSettings()

process.on('unhandledRejection', (reason, p) => {
  logger.error('Unhandled Rejection at:', p, 'reason:', reason)
})

module.exports = app.listen({
  host: settings.server.host,
  port: settings.server.port
}, () => {
  logger.info(`Bifrost started on http://${settings.server.host}:${settings.server.port}`)
})
