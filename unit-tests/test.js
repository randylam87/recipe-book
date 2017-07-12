// require assertions
var should = require("chai").should();
// require files
var config = require("../config/config.json");

var dialect = config.production.dialect;
// console.log(dialect);
// console.log(config.production.logging);
var logging = config.production.logging;
// console.log(logging);
// console.log(config.production.use_env_variable);
var variable = config.production.use_env_variable;
console.log(variable);

describe("Production Config: ", function(){
    it("\n-dialect should be 'mysql'", function(){
        dialect.should.equal("mysql");
    });

    it("\n-logging should be 'false'", function(){
        logging.should.equal(false);
    });

    it("\n-variable should be 'JAWSDB_URL'", function(){
        variable.should.equal("JAWSDB_URL");
    });
});