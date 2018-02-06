// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const request = sequelizeClient.define('request', {
    timeStamp: {
      type: DataTypes.DATE,
      allowNull: false
    },
    url: DataTypes.STRING,
    files: DataTypes.JSON,
    formData: DataTypes.JSON
  }, {
    hooks: {
      beforeCount (options) {
        options.raw = true
      }
    }
  })

  request.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }

  return request
}
