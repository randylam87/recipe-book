module.exports = (sequelize, DataTypes) => {
const Ingredient = sequelize.define("Ingredient", {
  ingredientName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1]
    }
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
  }),

  Ingredient.hasMany(models.Measurement, {
        foreignKey: {
          allowNull: false
        }
      });
}

return Ingredient;

};