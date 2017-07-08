module.exports = (sequelize, DataTypes) => {
  const Ingredients = sequelize.define("Post", {
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
  });

  Ingredients.associate = (models) => {
    Ingredients.belongsToMany(models.Recipes, {
      through: 'Measurements',
      foreignKey: { allowNull: false }
    });
  };
  
  return Ingredients;
};