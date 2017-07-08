module.exports = (sequelize, DataTypes) => {
  const Recipes = sequelize.define("recipes", {
      recipe: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: false,
        len: [1]
      }
    }, {
      classMethods: {
        associate: (models) => {
          Recipes.belongsTo(models.User, {
              foreignKey: {
                allowNull: false
              }
            }),
            Recipes.hasMany(models.Ingredients, {
              through: 'Measurements',
              foreignKey: {
                allowNull: false
              }
            });
        }
      }
    });
  return Recipes;
};