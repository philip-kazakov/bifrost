const setTimestamp = require('../../hooks/set-timestamp')
const makeRequest = require('../../hooks/make-request')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      setTimestamp(),
      makeRequest()
    ],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
