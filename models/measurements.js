module.exports = (connection, DataTypes) => {
  const Measurements = sequelize.define('measurements', {
    measurements: DataTypes.STRING
})
}