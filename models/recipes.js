module.exports = (sequelize, DataTypes) => {
  const Recipes = sequelize.define("Post", {
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
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
            foreignKey: 'userId'
          }),
          Recipes.hasMany(models.Ingredients, {
            through: 'Measurements',
            foreignKey: 'ingredientsID'
          });
      }
    }
  });
  return Post;
};