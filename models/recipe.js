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
    Recipe.hasMany(models.Ingredent, {
      foreignKey: {
        allowNull: false
      }
    })
  }
  return Recipe;
};



// , {
//   classMethods: {
//     associate: (models) => {
//       Recipes.belongsTo(models.User, {
//           foreignKey: {
//             allowNull: false
//           }
//         }),
//         Recipes.hasMany(models.Ingredients, {
//           through: {
//         model: Measurements,
//         unique:false
//       },
//           foreignKey: {
//             allowNull: false
//           }
//         });
//     }
//   }
// }