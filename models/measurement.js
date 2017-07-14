//Exports to ../server.js
//Shares a many:many relationship with ingredients
module.exports = (sequelize, DataTypes) => {
  const Measurements = sequelize.define('Measurements', {
    // Id: {
    //   autoIncrement: true,
    //   primaryKey: true,
    //   type: DataTypes.INTEGER
    // },
    measurement: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
  });
  return Measurements;
};