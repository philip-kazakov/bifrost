const logger = require('winston')
const standardSettings = require('standard-settings')

const app = require('./app')

const settings = standardSettings.getSettings()

const server = app.listen({
  host: settings.server.host,
  port: settings.server.port
})

process.on('unhandledRejection', (reason, p) => {
  logger.error('Unhandled Rejection at:', p, 'reason:', reason)
})

server.on('listening', () => {
  logger.info('Feathers application started on http://%s:%d', settings.server.host, settings.server.port)
})
