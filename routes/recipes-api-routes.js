let db = require("../models");

module.exports = function(app) {
  //Find all of the recipes - include users
  app.get("/api/recipes", function(req, res) {
    db.Recipes.findAll({
      include: [db.Users]
    }).then(function(recipesDB) {
      res.json(recipesDB);
    });
  });

  //Find one single recipe - include users
  app.get("/api/recipes/:id", function(req, res) {
    db.Recipes.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Users]
    }).then(function(recipesDB) {
      res.json(recipesDB);
    });
  });

  //Save a new recipe
  app.post("/api/recipes", function(req, res) {
    db.Recipes.create(req.body).then(function(recipesDB) {
      res.json(recipesDB);
    });
  });

  //Delete one single recipe
  app.delete("/api/recipes/:id", function(req, res) {
    db.Recipes.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(recipesDB) {
      res.json(recipesDB);
    });
  });

  //Update one single recipe
  app.put("/api/recipes", function(req, res) {
    db.Recipes.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(recipesDB) {
        res.json(recipesDB);
      });
  });
};
