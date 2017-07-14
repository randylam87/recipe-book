//Exports to ../server.js
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
    },
    prepTime: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [1]
    },
    cookTime: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [1]
    },
    notes: {
      type: DataTypes.TEXT,
      len: [1]
    },
    recipeImg: {
      type: DataTypes.TEXT,
      len: [1]
    }
  });

  Recipes.associate = function (models) {
    //many:one with Users
    Recipes.belongsTo(models.Users, {
      through: {
        model: 'Measurement',
        unique: false
      },
      foreignKey: {
        allowNull: false
      }
    });
    //many:many with Ingredients
    Recipes.hasMany(models.Ingredients, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Recipes;
};