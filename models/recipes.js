module.exports = (sequelize, DataTypes) => {
  var Recipes = sequelize.define("Post", {
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
      //need to research if i can do multiple associations.. need to associate recipes with ingredients
      associate:  (models) => {
        Post.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Post;
};