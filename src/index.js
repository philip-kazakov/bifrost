/* eslint-disable no-console */
const logger = require('./logger')
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
  console.log(
    `Feathers application started on http://${settings.get('server:host')}:${settings.get('server:port')}`
  )
)
