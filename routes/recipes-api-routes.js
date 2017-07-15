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
        }).then(function (queryResult) {
            let hbsObject = {
                recipe: queryResult,
                homePage: true
            };
            addUserToHbsObj(req, hbsObject);
            res.render('home', hbsObject);
        });
    });

    //Find recipe by recipe name - search
    app.get("/recipes/", function (req, res) {
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
            })
            .then(function (result) {
                let matchArray = [];
                result.forEach((data, index) => {
                    data.Ingredients.forEach((singleIngredient, index) => {
                        if (singleIngredient.ingredientName.toLowerCase().split(" ").indexOf(req.query.search.toLowerCase()) > -1) {
                            matchArray.push(data);
                            return;
                        }
                    });

                    if (data.recipeName.toLowerCase().split(" ").indexOf(req.query.search.toLowerCase()) > -1) {
                        matchArray.push(data);
                        return;
                    }
                });
                matchArray.push(req.user);
                let hbsObject = {
                    recipe: matchArray
                };

                addUserToHbsObj(req, hbsObject);
                res.render('home', hbsObject);
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
            let userInfo = req.user;
            res.render("editRecipePage", userInfo);
        });
    });

    //Find one single recipe - include users
    app.get("/recipes/:id", function (req, res) {
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
            console.log(recipesDB);
        });
    });

    //Loads new recipe page
    app.get('/new', isLoggedIn, (req, res) => {
        let userInfo = req.user;
        res.render('newRecipe', userInfo);
    });

    //Save a new recipe
    app.post("/recipes", isLoggedIn, function (req, res) {
        createRecipe(req, res);
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

    // Update one single recipe
    app.put("/recipes/:id", isLoggedIn, function (req, res) {
        db.Recipes.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (recipesDB) {
            createRecipe(req, res);
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
        nutritionArray.push({
            Calories: JSON.parse(body).calories
        });
        if ("FAT" in JSON.parse(body).totalNutrients) {
            nutritionArray.push({
                Fat: JSON.parse(body).totalNutrients.FAT.quantity
            });
        } else {
            nutritionArray.push({
                Fat: 0
            });
        }
        if ("PROCNT" in JSON.parse(body).totalNutrients) {
            nutritionArray.push({
                Protein: JSON.parse(body).totalNutrients.PROCNT.quantity
            });
        } else {
            nutritionArray.push({
                Protein: 0
            });
        }
        if ("CHOCDF" in JSON.parse(body).totalNutrients) {
            nutritionArray.push({
                Carbs: JSON.parse(body).totalNutrients.CHOCDF.quantity
            });
        } else {
            nutritionArray.push({
                Carbs: 0
            });
        }
        recipesDB = recipesDB.toJSON();
        //Checks to see if there are no nutrients
        if (nutritionArray[0].Calories + nutritionArray[1].Fat + nutritionArray[2].Protein + nutritionArray[3].Carbs === 0) {
            nutritionArray = false;
        }
        recipesDB.nutrition = nutritionArray;
        //IF LOGGED IN & USER IS ALSO THE AUTHOR
        if (req.user && req.user.id == recipesDB.User.id) {
            recipesDB.match = {
                match: true
            };
        }
        res.render("viewRecipePage", recipesDB);
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
let createIngredients = (data, ingredient, measurement, req, res) => {
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

let createRecipe = (req, res) => {
    if (req.body.recipeImg) {
        db.Recipes.create({
            UserId: req.body.userId,
            recipeName: req.body.recipeName,
            recipeInstructions: req.body.recipeInstructions,
            prepTime: req.body.prepTime,
            cookTime: req.body.cookTime,
            notes: req.body.notes,
            recipeImg: req.body.recipeImg
        }).then((data) => {
            //looping through and creating table row for each ingredient and measurement
            if (Array.isArray(req.body.ingredientName)) {
                for (i = 0; i < req.body.ingredientName.length; i++) {
                    createIngredients(data, req.body.ingredientName[i], req.body.measurement[i], req, res);
                }
            } else {
                createIngredients(data, req.body.ingredientName, req.body.measurement, req, res);
            }
            res.redirect('/');
        });
    } else {
        db.Recipes.create({
            UserId: req.body.userId,
            recipeName: req.body.recipeName,
            recipeInstructions: req.body.recipeInstructions,
            prepTime: req.body.prepTime,
            cookTime: req.body.cookTime,
            notes: req.body.notes
        }).then((data) => {
            //looping through and creating table row for each ingredient and measurement
            if (Array.isArray(req.body.ingredientName)) {
                for (i = 0; i < req.body.ingredientName.length; i++) {
                    createIngredients(data, req.body.ingredientName[i], req.body.measurement[i], req, res);
                }
            } else {
                createIngredients(data, req.body.ingredientName, req.body.measurement, req, res);
            }
            res.redirect('/');
        });
    }
};