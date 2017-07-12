//exports to ..routes/auth.js
var exports = module.exports = {};

exports.signup = function(req,res){
	res.redirect('/');
};

exports.signin = function(req,res){
	res.redirect('/');
};

exports.home = function(req,res){
	let userInfo = req.user;
  // res.render('home', {});
  res.redirect('/');
};

exports.logout = function(req,res){
  req.session.destroy(function(err) {
  res.redirect('/');
  });
};