const standardSettings = require('standard-settings')
const Sequelize = require('sequelize')
const winston = require('winston')

const settings = standardSettings.getSettings()

const sequelize = new Sequelize('mainDB', '', '', {
  dialect: 'sqlite',
  storage: './../../db.sqlite'
})

// MODELS
const Request = sequelize.define('Request', {
  timeStamp: Sequelize.DATE,
  body: Sequelize.JSON
})

// SYNC SCHEMA
sequelize
  .sync({
    force: settings.flag.dropTables
  })
  .catch(err => {
    winston.error('An error occurred while creating the table:', err)
  })

module.exports = { Request }
