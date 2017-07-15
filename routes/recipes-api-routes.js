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
            console.log(hbsObject);
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
                    if (data.recipeName.toLowerCase().split(" ").indexOf(req.query.search.toLowerCase()) > -1) {
                        matchArray.push(data);
                        return;
                    }
                    data.Ingredients.forEach((singleIngredient, index) => {
                        if (singleIngredient.ingredientName.toLowerCase().split(" ").indexOf(req.query.search.toLowerCase()) > -1) {
                            matchArray.push(data);
                            return;
                        }
                    });
                });
                // matchArray.push(req.user);
                let hbsObject = {
                    recipe: matchArray
                };

                addUserToHbsObj(req, hbsObject);
                console.log(hbsObject);
                // res.json(hbsObject);
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
            res.redirect('/');
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
    let nutritionArray = []; //MACRO NUTRIENTS
    let nutritionArray2 = []; //ALL NUTRIENTS
    request(`https://api.edamam.com/api/nutrition-data?app_id=${appID}&app_key=${apiKey}&ingr=${ingredients}`, function (error, response, body) {
        //MACRO NUTRITION
        nutritionArray.push({
            Calories: JSON.parse(body).calories
        });
        keyExist(body, nutritionArray, "FAT", "Fat");
        keyExist(body, nutritionArray, "PROCNT", "Protein");
        keyExist(body, nutritionArray, "CHOCDF", "Carbs");
        //VITAMIN AND MINERALS
        keyExist(body, nutritionArray2, "CA", "Calcium");
        keyExist(body, nutritionArray2, "MG", "Magnesium");
        keyExist(body, nutritionArray2, "K", "Potassium");
        keyExist(body, nutritionArray2, "FE", "Iron");
        keyExist(body, nutritionArray2, "ZN", "Zinc");
        keyExist(body, nutritionArray2, "P", "Phosphorus");
        keyExist(body, nutritionArray2, "VITC", "VitaminC");
        keyExist(body, nutritionArray2, "RIBF", "Riboflavin");
        keyExist(body, nutritionArray2, "VITB6A", "VitaminB6");
        keyExist(body, nutritionArray2, "VITB12", "VitaminB12");

        recipesDB = recipesDB.toJSON();
        //Checks to see if there are no nutrients
        if (nutritionArray[0].Calories + nutritionArray[1].Fat + nutritionArray[2].Protein + nutritionArray[3].Carbs === 0) {
            nutritionArray = false;
            nutritionArray2 = false;
        }
        recipesDB.nutrition = nutritionArray;
        recipesDB.nutrition2 = nutritionArray2;
        //IF LOGGED IN & USER IS ALSO THE AUTHOR
        if (req.user && req.user.id == recipesDB.User.id) {
            recipesDB.match = {
                match: true
            };
        }
        if (req.user) {
            recipesDB.currentUser = {
                currentUserId: req.user.id,
                currentUsername: req.user.username
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


let verifyNutrition = (body, nutritionArray, nutrientName, dataNutrient) => {
    tempObj = {};
    tempObj[nutrientName] = dataNutrient;
    nutritionArray.push(tempObj);
};

let keyExist = (body, nutritionArray, nameStr, nutrientName) => {
    if (nameStr in JSON.parse(body).totalNutrients) {
        if (nutrientName == "Fat") {
            verifyNutrition(body, nutritionArray, nutrientName, JSON.parse(body).totalNutrients.FAT.quantity);
        }
        if (nutrientName == "Protein") {
            verifyNutrition(body, nutritionArray, nutrientName, JSON.parse(body).totalNutrients.PROCNT.quantity);
        }
        if (nutrientName == "Carbs") {
            verifyNutrition(body, nutritionArray, nutrientName, JSON.parse(body).totalNutrients.CHOCDF.quantity);
        }
        if (nutrientName == "Calcium") {
            verifyNutrition(body, nutritionArray, nutrientName, JSON.parse(body).totalNutrients.CA.quantity);
        }
        if (nutrientName == "Magnesium") {
            verifyNutrition(body, nutritionArray, nutrientName, JSON.parse(body).totalNutrients.MG.quantity);
        }
        if (nutrientName == "Potassium") {
            verifyNutrition(body, nutritionArray, nutrientName, JSON.parse(body).totalNutrients.K.quantity);
        }
        if (nutrientName == "Iron") {
            verifyNutrition(body, nutritionArray, nutrientName, JSON.parse(body).totalNutrients.FE.quantity);
        }
        if (nutrientName == "Zinc") {
            verifyNutrition(body, nutritionArray, nutrientName, JSON.parse(body).totalNutrients.ZN.quantity);
        }
        if (nutrientName == "Phosphorus") {
            verifyNutrition(body, nutritionArray, nutrientName, JSON.parse(body).totalNutrients.P.quantity);
        }
        if (nutrientName == "VitaminC") {
            verifyNutrition(body, nutritionArray, nutrientName, JSON.parse(body).totalNutrients.VITC.quantity);
        }
        if (nutrientName == "Riboflavin") {
            verifyNutrition(body, nutritionArray, nutrientName, JSON.parse(body).totalNutrients.RIBF.quantity);
        }
        if (nutrientName == "VitaminB6") {
            verifyNutrition(body, nutritionArray, nutrientName, JSON.parse(body).totalNutrients.VITB6A.quantity);
        }
        if (nutrientName == "VitaminB12") {
            verifyNutrition(body, nutritionArray, nutrientName, JSON.parse(body).totalNutrients.VITB12.quantity);
        }
    } else {
        tempObj = {};
        tempObj[nutrientName] = 0;
        nutritionArray.push(tempObj);
    }
};