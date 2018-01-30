const NanoTimer = require('nanotimer')
const settings = require('standard-settings')

class Service {
  constructor () {
    this.timer = new NanoTimer()
  }

  async create (handle) {
    await this.remove()

    if (Object.prototype.toString.call(handle) === '[object Function]') {
      this.timer.setTimeout(handle, [this.timer], settings.get('timeout'))
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
