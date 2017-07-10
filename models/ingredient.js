//Exports to ../server.js
module.exports = (sequelize, DataTypes) => {
  const Ingredients = sequelize.define("Ingredients", {
    ingredientName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  });
  Ingredients.associate = (models) => {
    //many:many with Recipes
    Ingredients.belongsToMany(models.Recipes, {
      through: {
        model: 'Measurements',
        unique: false
      },
      foreignKey: "RecipeId"
    });
    //many:many with Measurements
    Ingredients.hasMany(models.Measurements, {
      foreignKey: "IngredientId"
    });
  };
  return Ingredients;
};