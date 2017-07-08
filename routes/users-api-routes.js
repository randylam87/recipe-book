let db = require("../models");

module.exports = function(app) {
  
  //Find all of the users - include recipes
  app.get("/api/users", function(req, res) {
    db.User.findAll({
      include: [db.Recipe]
    }).then(function(usersDB) {
      res.json(usersDB);
    });
  });
  
  //Find one single user - include recipes
  app.get("/api/users/:id", function(req, res) {
    db.User.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Recipe]
    }).then(function(usersDB) {
      res.json(usersDB);
    });
  });
  
  //Save a new user
  app.post("/api/users", function(req, res) {
    db.User.create(req.body).then(function(usersDB) {
      res.json(usersDB);
    });
  });
  
  //Delete one single user
  app.delete("/api/users/:id", function(req, res) {
    db.User.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(usersDB) {
      res.json(usersDB);
    });
  });

};
