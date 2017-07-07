module.exports = (sequelize, DataTypes) => {
  const Ingredients = sequelize.define("Post", {
    ingredientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    ingredient: {
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
      //need to research if i can do multiple associations.. need to associate recipes with ingredients
      associate:  (models) => {
        Ingredients.belongsToMany(models.Recipes, {
          through: 'Measurements',
          foreignKey: 'recipeID'
        });
      }
    }
  });
  return Post;
};