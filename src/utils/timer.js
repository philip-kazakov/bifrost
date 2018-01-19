const standardSettings = require('standard-settings')
const NanoTimer = require('nanotimer')

const queue = require('./queue')

const settings = standardSettings.getSettings()

class Timer {
  constructor () {
    this.timer = new NanoTimer()
  }

  start () {
    this.clearTimer()
    this.timer.setTimeout(queue.handle, [this.timer], settings.timeout)
  }

  clear () {
    if (this.timer) {
      this.timer.clearTimeout()
    }
  }
}

module.exports = new Timer()
