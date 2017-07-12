// require assertions
var should = require("chai").should();
// require files
var config = require("../config/config.json");
var controller = require("../controllers/authcontroller.js");

// config variables
var dialect = config.production.dialect;
var logging = config.production.logging;
var variable = config.production.use_env_variable;

// production config tests
describe("Production Config: ", function(){
    it("dialect should be 'mysql'", function(){
        dialect.should.equal("mysql");
    });

    it("logging should be 'false'", function(){
        logging.should.equal(false);
    });

    it("variable should be 'JAWSDB_URL'", function(){
        variable.should.equal("JAWSDB_URL");
    });
});

controller.signup

// authcontroller tests
// describe("Controller", function(){
//     it("renders the sign up page", function(){

//     })
// })
