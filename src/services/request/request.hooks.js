const setTimestamp = require('../../hooks/set-timestamp')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [setTimestamp()],
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
