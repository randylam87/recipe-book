var exports = module.exports = {};


exports.signup = function(req,res){
	res.render('signup'); 
};

exports.signin = function(req,res){
	res.render('signin'); 
};

exports.home = function(req,res){
	res.render('home'); 
};

exports.logout = function(req,res){

  req.session.destroy(function(err) {
  res.redirect('/');
  });

};