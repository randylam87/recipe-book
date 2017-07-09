module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define("User", {
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

  User.associate = function (models) {
    User.hasMany(models.Recipe, {
      onDelete: 'cascade',
      foreignKey: {
        allowNull: false
      }
    });
  };
  return User;
};