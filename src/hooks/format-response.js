// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    if (context.result && context.result.isHook) {
      context.result = context.result.data
    } else {
      context.result = {
        proxy: 'saved'
      }

      const handle = async () => {
        const requests = await context.app.service('request').find()

        if (Array.isArray(requests) && requests.length) {
          await context.app.service('timer').create(handle)
        } else {
          await context.app.service('timer').remove()
        }

        requests.forEach(request => {

        })
      }

      await context.app.service('timer').create(handle)
    }

    return context
  }
}
