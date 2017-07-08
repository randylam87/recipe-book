module.exports = (sequelize, DataTypes) => {
  const Ingredients = sequelize.define("ingredients", {
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
      associate: (models) => {
        Ingredients.belongsToMany(models.Recipe, {
          through: {
            model: Measurements,
            unique:false
          },
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Ingredients;
};