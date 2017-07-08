module.exports = (sequelize, DataTypes) => {
  const Measurements = sequelize.define('measurements', {
    measurements: DataTypes.STRING
  });
  
return Measurements;
};