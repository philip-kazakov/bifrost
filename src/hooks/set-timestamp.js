// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    if (!context.data.timeStamp) {
      context.data.timeStamp = new Date().getTime()
    }

    return context
  }
}
