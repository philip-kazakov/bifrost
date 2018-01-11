const path = require('path')
const compress = require('compression')
const cors = require('cors')
const helmet = require('helmet')
const logger = require('winston')

const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')

const middleware = require('./middleware')
const services = require('./services')
const appHooks = require('./app.hooks')
const channels = require('./channels')

const Sequelize = require('sequelize')
const service = require('feathers-sequelize')

const sequelize = new Sequelize('sequelize', '', '', {
  dialect: 'sqlite',
  storage: path.join(__dirname, 'db.sqlite'),
  logging: false
})

const app = express(feathers())

app.set('view engine', 'ejs')

app.use(cors())
app.use(helmet())
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static(path.join(__dirname, '..', 'public')))

app.get('/', (req, res) => {
  res.render(path.join(__dirname, 'views', 'index.ejs'), {
    lengthQueue: 0,
    pendingQueue: []
  })
})

// Set up Plugins and providers
app.configure(express.rest())
app.configure(socketio())

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware)
// Set up our services (see `services/index.js`)
app.configure(services)
// Set up event channels (see channels.js)
app.configure(channels)

app.use(express.notFound())
app.use(express.errorHandler({ logger }))

app.hooks(appHooks)

module.exports = app
