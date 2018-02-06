const NanoTimer = require('nanotimer')
const settings = require('standard-settings')

class Service {
  constructor () {
    this.timer = new NanoTimer()
  }

  async create ({ handler }) {
    await this.remove(0)

    if (handler) {
      this.timer.setTimeout(handler, [this.timer], settings.get('timeout'))
    }

    return 'OK'
  }

  async remove () {
    if (this.timer) {
      this.timer.clearTimeout()
    }

    return 'OK'
  }
}

module.exports = function () {
  return new Service()
}

module.exports.Service = Service
