//exports to ..routes/auth.js
var exports = module.exports = {};

exports.signup = function(req,res){
	res.render('signup'); 
};

exports.signin = function(req,res){
	res.render('signin'); 
};

exports.home = function(req,res){
	let userInfo = req.user;
  res.render('home', userInfo);
};

exports.logout = function(req,res){
  req.session.destroy(function(err) {
  res.redirect('/');
  });
};