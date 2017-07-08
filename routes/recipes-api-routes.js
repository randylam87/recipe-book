let db = require("../models");
let request = require('request');

let updateNutrition = (recipe) => {

};

module.exports = function(app) {
    //Find all of the recipes - include users
    app.get("/api/recipes", function(req, res) {
        db.Recipe.findAll({
            include: [db.User]
        }).then(function(recipesDB) {
            request('https://api.edamam.com/api/nutrition-data?app_id=936c8444&app_key=6ebac7e6562262d5b1213134d8d7fe4a&ingr=1 slice of chocolate cake', function(error, response, body) {
                console.log('calories:', JSON.parse(body).calories);
            });
            res.render("home",recipesDB);
        });
    });

    //Find one single recipe - include users
    app.get("/api/recipes/:id", function(req, res) {
        db.Recipe.findOne({
            where: {
                id: req.params.id
            },
            include: [db.User]
        }).then(function(recipesDB) {
            res.json(recipesDB);
        });
    });

    //Save a new recipe
    app.post("/api/recipes", function(req, res) {
        db.Recipe.create(req.body).then(function(recipesDB) {
            res.json(recipesDB);
        });
    });

    //Delete one single recipe
    app.delete("/api/recipes/:id", function(req, res) {
        db.Recipe.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(recipesDB) {
            res.json(recipesDB);
        });
    });

    //Update one single recipe
    app.put("/api/recipes", function(req, res) {
        db.Recipe.update(
            req.body, {
                where: {
                    id: req.body.id
                }
            }).then(function(recipesDB) {
            res.json(recipesDB);
        });
    });
};
