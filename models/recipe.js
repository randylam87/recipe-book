module.exports = function (sequelize, DataTypes) {
  const Recipe = sequelize.define("Recipe", {
    recipeName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    recipeInstructions: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1]
    }
  });

  Recipe.associate = function (models) {

    Recipe.belongsTo(models.User, {
        through: {
          model: 'Measurement',
          unique: false
        },
        foreignKey: {
          allowNull: false
        }
      }),
      Recipe.hasMany(models.Ingredient, {
        foreignKey: {
          allowNull: false
        }
      });
  };
  return Recipe;
};