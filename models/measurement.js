module.exports = (sequelize, DataTypes) => {
  const Measurement = sequelize.define('Measurement', {
    Id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    measurement: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
  });

  return Measurement;
};