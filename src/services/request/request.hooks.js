const setTimestamp = require('../../hooks/set-timestamp')
const checkRequest = require('../../hooks/check-request')
const formatResponse = require('../../hooks/format-response')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      setTimestamp(),
      checkRequest()
    ],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [
      formatResponse()
    ],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
