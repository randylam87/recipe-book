let db = require("../models");
let request = require('request');

module.exports = function (app) {
    ////////////////////////THESE ARE FOR TESTING
    //Find all of the recipes - include users
    app.get("/recipes/all", function (req, res) {
        db.Recipes.findAll({
            include: [{
                model: db.Ingredients,
                include: [
                    db.Measurements
                ]
            }, {
                model: db.Users
            }]
        }).then(function (recipesDB) {
            // console.log(recipesDB);
            res.json(recipesDB);
            // res.render("viewRecipePage");
        });
    });
    //Find recipe by ingredient
    app.get("/recipes/", function (req, res) {
        db.Recipes.findAll({
                include: [{
                    model: db.Ingredients
                }]
            })
            .then(function (result) {
                result.forEach((data, index) => {
                    if (data.recipeName.toLowerCase().indexOf(req.query.search.toLowerCase()) == -1) {
                        result.splice(index, 1);
                    }
                });
                res.json(result);
            });
    });

    //Edit Recipes
    app.get('/edit', isLoggedIn, (req, res) => {
        db.Recipes.findAll({
            include: [{
                model: db.Ingredients,
                include: [
                    db.Measurements
                ]
            }]
        }).then((recipesDB) => {
            res.render("editRecipePage");
        });
    });

    //View All Recipes
    app.get('/all', (req, res) => {
        db.Recipes.findAll({
            include: [{
                model: db.Ingredients,
                include: [
                    db.Measurements
                ]
            }]
        }).then((data) => {
            let recipesArr = [];
            data.forEach((recipes) => {
                recipesArr.push(recipes.dataValues);
            });
            let allRecipes = {
                recipes: recipesArr
            };
            // console.log(allRecipes);
            res.render("viewRecipePage", allRecipes);
        });
    });
    ///////////////////////END TESTING

    //Root
    app.get('/', function (req, res) {
        // console.log(req);
        let userInfo = req.user;
        res.render('home', userInfo);
    });

    //Find one single recipe - include users
    app.get("/recipes/:id", function (req, res) {
        console.log(req.params);
        db.Recipes.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: db.Ingredients,
                include: [
                    db.Measurements
                ]
            }, {
                model: db.Users
            }]
        }).then(function (recipesDB) {

            findAllIngredients(recipesDB, res);
            // res.json(recipesDB);
        });
    });

    //Loads new recipe page
    app.get('/new', isLoggedIn, (req, res) => {
        // console.log(req.user);
        let userInfo = req.user;
        res.render('newRecipe', userInfo);
    });

    //Save a new recipe
    app.post("/recipes", isLoggedIn, function (req, res) {
        console.log(req.body);
        db.Recipes.create({
            UserId: req.body.userId,
            recipeName: req.body.recipeName,
            recipeInstructions: req.body.recipeInstructions
        }).then((data) => {
            //looping through and creating table row for each ingredient and measurement
            for (i = 0; i < req.body.ingredientName.length; i++) {
                updateIngredients(data, req.body.ingredientName[i], req.body.measurement[i], req, res);
            }
        });
    });

    //Delete one single recipe
    app.delete("/recipes/:id", isLoggedIn, function (req, res) {
        db.Recipes.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (recipesDB) {
            res.json(recipesDB);
        });
    });

    //Update one single recipe
    app.put("/recipes", isLoggedIn, function (req, res) {
        db.Recipes.update(
            req.body, {
                where: {
                    id: req.body.id
                }
            }).then(function (recipesDB) {
            res.json(recipesDB);
        });
    });

};

//helper functions

// Finds nutrition value then sends the object
let updateNutrition = (ingredients, res, recipesDB) => {
    let apiKey = "6ebac7e6562262d5b1213134d8d7fe4a";
    let appID = "936c8444";
    let nutritionArray = [];
    request(`https://api.edamam.com/api/nutrition-data?app_id=${appID}&app_key=${apiKey}&ingr=${ingredients}`, function (error, response, body) {

        //Nutrition Array Order = Calories, Fat, Protein, Carbs
        nutritionArray.push(JSON.parse(body).calories);
        nutritionArray.push(JSON.parse(body).totalNutrients.FAT.quantity);
        nutritionArray.push(JSON.parse(body).totalNutrients.PROCNT.quantity);
        nutritionArray.push(JSON.parse(body).totalNutrients.CHOCDF.quantity);

        recipesDB = recipesDB.toJSON();
        recipesDB.nutrition = nutritionArray;
        res.json(recipesDB);
    });
};
// Finds all the ingredients before finding nutritional value
let findAllIngredients = (recipesDB, res) => {
    let ingredientsArray = [];
    for (i = 0; i < recipesDB.Ingredients.length; i++) {
        ingredientsArray.push(recipesDB.Ingredients[i].Measurements[0].dataValues.measurement + " " + recipesDB.Ingredients[i].ingredientName);
    }
    updateNutrition(ingredientsArray.join(" and "), res, recipesDB);
};

// Adds Ingredients to Database
let updateIngredients = (data, ingredient, measurement, req, res) => {
    db.Ingredients.create({
        RecipeId: data.dataValues.id,
        ingredientName: ingredient
    }).then((data) => {
        console.log(data);
        db.Measurements.create({
            IngredientId: data.dataValues.id,
            measurement: measurement
        }).then(function (recipesDB) {
            // res.redirect('/recipes');
        });
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/home');
}