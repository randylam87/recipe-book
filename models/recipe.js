module.exports = function (sequelize, DataTypes) {
  const Recipe = sequelize.define("Recipe", {
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
  });

  Recipe.associate = function (models) {
    Recipe.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    }),
    Recipe.hasMany(models.Ingredient, {
      foreignKey: {
        allowNull: false
      }
    })
  }
  return Recipe;
};