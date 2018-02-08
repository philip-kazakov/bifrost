const { createLogger, transports: { File }, format } = require('winston')
const { combine, timestamp, prettyPrint, printf } = format

module.exports = createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    prettyPrint(),
    printf(info => {
      return `[${info.timestamp}] [${info.level}] ${info.message}`
    })
  ),
  transports: [
    new File({
      filename: 'errors.log',
      level: 'error'
    }),
    new File({
      filename: 'combined.log'
    })
  ]
})
