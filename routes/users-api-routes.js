let db = require("../models");

module.exports = function(app) {
  
  //Find all of the users - include recipes
  app.get("/api/users", function(req, res) {
    db.Users.findAll({
      include: [db.Recipes]
    }).then(function(usersDB) {
      res.json(usersDB);
    });
  });
  
  //Find one single user - include recipes
  app.get("/api/users/:id", function(req, res) {
    db.Users.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Recipes]
    }).then(function(usersDB) {
      res.json(usersDB);
    });
  });
  
  //Save a new user
  app.post("/api/users", function(req, res) {
    db.Users.create(req.body).then(function(usersDB) {
      res.json(usersDB);
    });
  });
  
  //Delete one single user
  app.delete("/api/users/:id", function(req, res) {
    db.Users.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(usersDB) {
      res.json(usersDB);
    });
  });

};
