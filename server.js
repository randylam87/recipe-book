const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;
const passport = require('passport');
const env = require('dotenv').load();
const db = require("./models");

////Middleware
//BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
  type: "application/vnd.api+json"
}));

//Method Override
app.use(methodOverride("_method"));

//Public
app.use(express.static(path.join(__dirname, 'public')));

//Passport
app.use(session({
  secret: 'super duper secret code',
  resave: true,
  saveUninitialized: true
})); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//Load passport strategies
require('./config/passport/passport.js')(passport, db.Users);

//For Handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Routes
var authRoute = require('./routes/auth.js')(app, passport);
require("./routes/recipes-api-routes.js")(app);
require("./routes/users-api-routes.js")(app);

//Sequelize Sync Database
db.sequelize.sync().then(function () {
  console.log('Nice! Database looks fine');

}).catch(function (err) {
  console.log(err, "Something went wrong with the Database Update!");
});

//Server Listener
app.listen(PORT, function (err) {
  if (!err)
    console.log(`Site is live on port: ${PORT}`);
  else console.log(err);
});