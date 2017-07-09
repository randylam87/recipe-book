module.exports = function (sequelize, DataTypes) {
  const Recipes = sequelize.define("Recipes", {
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

  Recipes.associate = function (models) {

    Recipes.belongsTo(models.Users, {
        through: {
          model: 'Measurement',
          unique: false
        },
        foreignKey: {
          allowNull: false
        }
      });
      Recipes.hasMany(models.Ingredients, {
        foreignKey: {
          allowNull: false
        }
      });
  };
  return Recipes;
};