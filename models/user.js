//Exports to ../server.js
module.exports = function (sequelize, DataTypes) {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.TEXT
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  });
  //one:many with Recipies
  Users.associate = function (models) {
    Users.hasMany(models.Recipes, {
      onDelete: 'cascade',
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Users;
};