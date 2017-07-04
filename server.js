const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));

app.use(methodOverride("_method"));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
 
app.get('/', function (req, res) {
    res.render('home');
});
 
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});