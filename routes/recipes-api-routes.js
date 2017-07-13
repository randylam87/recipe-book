let db = require("../models");
let request = require('request');

module.exports = function (app) {

    //Main Page - Takes all recipes
    app.get("/", function (req, res) {
        let userInfo = req.user;
        db.Recipes.findAll({
            include: [{
                model: db.Ingredients,
                include: [
                    db.Measurements
                ]
            }, {
                model: db.Users,
                attributes: ["id", "username"]
            }]
        }, {
            limit: 10
        }).then(function (queryResult) {
            let hbsObject = {
                recipe: queryResult,
            }
            addUserToHbsObj(req,hbsObject);
            // res.json(hbsObject);
            // console.log(hbsObject)
            res.render('home', hbsObject);
        });
    });
    //test
    app.get("/test", function (req, res) {
        let userInfo = req.user;
        db.Recipes.findAll({
            include: [{
                model: db.Ingredients,
                include: [
                    db.Measurements
                ]
            }, {
                model: db.Users,
                attributes: ["id", "username"]
            }]
        }, {
            limit: 10
        }).then(function (queryResult) {
            let hbsObject = {
                query: queryResult,
            }
            addUserToHbsObj(req,hbsObject);
            // res.json(hbsObject);
            // console.log(hbsObject)
            res.json(hbsObject);
        });
    });

    //Main Page Pagination - Takes all recipes and displays 10 results based on page number
    app.get("/all/page/:number", function (req, res) {
        let pageNumber = req.params.number;
        let pageOffset = (pageNumber * 10) + 1;
        let userInfo = req.user;
        db.Recipes.findAll({
            include: [{
                model: db.Ingredients,
                include: [
                    db.Measurements
                ]
            }, {
                model: db.Users,
                attributes: ["id", "username"]
            }]
        }, {
            offset: pageOffset,
            limit: 10
        }).then(function (recipesDB) {
            recipesDB.push(req.user);
            res.render('home', recipesDB);
        });
    });

    //Find recipe by recipe name - search
    app.get("/recipes/", function (req, res) {
        db.Recipes.findAll({
                include: [{
                    model: db.Ingredients,
                    include: [
                        db.Measurements
                    ]
                }, {
                    model: db.Users,
                    attributes: ["id", "username"]
                }]
            })
            .then(function (result) {
                result.forEach((data, index) => {
                    if (data.recipeName.toLowerCase().indexOf(req.query.search.toLowerCase()) == -1) {
                        result.splice(index, 1);
                    }
                });
                result.push(req.user);
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
    // app.get('/all', (req, res) => {
    //     db.Recipes.findAll({
    //         include: [{
    //             model: db.Ingredients,
    //             include: [
    //                 db.Measurements
    //             ]
    //         }]
    //     }).then((data) => {
    //         let recipesArr = [];
    //         data.forEach((recipes) => {
    //             recipesArr.push(recipes.dataValues);
    //         });
    //         let allRecipes = {
    //             recipes: recipesArr
    //         };
    //         // console.log(allRecipes);
    //         res.render("viewRecipePage", allRecipes);
    //     });
    // });
    ///////////////////////END TESTING

    //Root
    // app.get('/', function (req, res) {
    //     // console.log(req);
    //     let userInfo = req.user;
    //     res.render('home', userInfo);
    // });

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
                model: db.Users,
                attributes: ["id", "username"]
            }]
        }).then(function (recipesDB) {

            findAllIngredients(recipesDB, res, req);
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
            res.redirect('/new');
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
    //Recipes API JSON Object
    app.get("/api/recipes/all", function (req, res) {
        let userInfo = req.user;
        db.Recipes.findAll({
            include: [{
                model: db.Ingredients,
                attributes: ["ingredientName"],
                include: [{
                    model: db.Measurements,
                    attributes: ["measurement"]
                }]
            }, {
                model: db.Users,
                attributes: ["username"]
            }],
            attributes: ["id", "recipeName", "recipeInstructions", "createdAt"]
        }).then(function (recipesDB) {
            res.json(recipesDB);
        });
    });

};

//helper functions

// Finds nutrition value then sends the object
let updateNutrition = (ingredients, res, recipesDB, req) => {
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
        if (req.user) {
            recipesDB.currentUser = {
                id: req.user.id,
                username: req.user.username
            };
        }

        res.json(recipesDB);
    });
};
// Finds all the ingredients before finding nutritional value
let findAllIngredients = (recipesDB, res, req) => {
    let ingredientsArray = [];
    for (i = 0; i < recipesDB.Ingredients.length; i++) {
        ingredientsArray.push(recipesDB.Ingredients[i].Measurements[0].dataValues.measurement + " " + recipesDB.Ingredients[i].ingredientName);
    }
    updateNutrition(ingredientsArray.join(" and "), res, recipesDB, req);
};

// Adds Ingredients to Database
let updateIngredients = (data, ingredient, measurement, req, res) => {
    db.Ingredients.create({
        RecipeId: data.dataValues.id,
        ingredientName: ingredient
    }).then((data) => {
        // console.log(data);
        db.Measurements.create({
            IngredientId: data.dataValues.id,
            measurement: measurement
        }).then(function (recipesDB) {
            // res.redirect('/recipes');
        });
    });
};

let addUserToHbsObj = (req, hbsObject) => {
    if (req.user) {
        hbsObject.currentUser = {
            currentUserId: req.user.id,
            currentUsername: req.user.username
        };
    }
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}