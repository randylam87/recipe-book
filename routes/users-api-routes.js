let db = require("../models");

module.exports = function (app) {

  //Find all of the users - include recipes
  app.get("/users", isLoggedIn, function (req, res) {
    db.Users.findAll({
      include: [db.Recipes]
    }).then(function (usersDB) {
      res.json(usersDB);
    });
  });

  //Find one single user - include recipes
  app.get("/users/:id", isLoggedIn, function (req, res) {
    db.Users.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Recipes]
    }).then(function (usersDB) {
      res.json(usersDB);
    });
  });

  //Save a new user
  app.post("/users", isLoggedIn, function (req, res) {
    console.log(req.body);
    db.Users.create(req.body).then(function (usersDB) {
      res.json(usersDB);
    });
  });

  //Delete one single user
  app.delete("/users/:id", isLoggedIn, function (req, res) {
    db.Users.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (usersDB) {
      res.json(usersDB);
    });
  });
};

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();

    res.redirect('/signin');
  }
