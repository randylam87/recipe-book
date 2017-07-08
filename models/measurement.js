module.exports = (sequelize, DataTypes) => {
  const Measurement = sequelize.define('Measurement', {
    measurements: DataTypes.STRING
  });

  return Measurement;
};