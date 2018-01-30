/* eslint-disable no-console */
const logger = require('winston')
const settings = require('standard-settings')

const app = require('./app')

const server = app.listen({
  host: settings.get('server:host'),
  port: settings.get('server:port')
})

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
)

server.on('listening', () =>
  logger.info(
    'Feathers application started on http://%s:%d',
    settings.get('server:host'),
    settings.get('server:port')
  )
)
