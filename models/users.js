module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      validate: {
        len: [1, 15]
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: [1, 15]
      }
    }
  }, {
    //  {
    //   hooks: {
    //     afterValidate: (user) => {
    //       hashes password after a valid password is entered
    //       user.password = bcrypt.hashSync(user.password, 8);
    //     }
    //   }
    // }, 

    classMethods: {
      associate: (models) => {
        User.hasMany(models.Recipes, {
          onDelete: 'cascade',
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return User;
};