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
const router = express.Router();

//BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
  type: "application/vnd.api+json"
}));

//Passport
app.use(session({
  secret: 'super duper secret code',
  resave: true,
  saveUninitialized: true
})); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//Public
app.use(express.static(path.join(__dirname, '/public')));

app.use(methodOverride("_method"));

//For Handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  res.render('home');
});

//Routes
var authRoute = require('./routes/auth.js')(app, passport);
require("./routes/recipes-api-routes.js")(router);
require("./routes/users-api-routes.js")(router);

//load passport strategies
require('./config/passport/passport.js')(passport, db.user);

//Sync Database
db.sequelize.sync().then(function () {
  console.log('Nice! Database looks fine');

}).catch(function (err) {
  console.log(err, "Something went wrong with the Database Update!");
});


app.listen(8080, function (err) {
  if (!err)
    console.log("Site is live");
  else console.log(err);

});
