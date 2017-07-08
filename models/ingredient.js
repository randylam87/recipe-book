module.exports = (sequelize, DataTypes) => {
const Ingredient = sequelize.define("Ingredient", {
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

Ingredient.associate = (models) => {
  Ingredient.belongsToMany(models.Recipe, {
    through: {
      model: 'Measurement',
      unique: false
    },
    foreignKey: {
      allowNull: false
    }
  });
}

return Ingredient;

};