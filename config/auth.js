const Joi = require('joi');

//  Validation Using @hapi/joi
const registerValidation = data => {  //  Validation for Registeration
const Schema = {
  name : Joi.string().min(5).required(),
  email : Joi.string().min(10).required().email(),
  password : Joi.string().min(8).required()
};
return Joi.validate(data,Schema);
};  

const productValidation = data => {  //  Validation for Registeration
const Schema = {
  name : Joi.string().min(5).required(),
  imgname : Joi.string().required(),
  company : Joi.string().min(2).required(),
  price : Joi.int().required()
};
return Joi.validate(data,Schema);
};

const loginValidation = data => {   //  Validation for Login
const Schema = {
  email : Joi.string().min(6).required().email(),
  password : Joi.string().min(6).required()
};
return Joi.validate(data,Schema); 
};

module.exports = {
  checkAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) { // mean login ha
      res.set('Cache-Control','no-cache , private, no-store, must-revalidate, post-check=0, pre-check=0');
      return next();
    }
      res.redirect("/index");
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/index');      
  },
  ensureAdminAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
          return next();
    }
    req.flash("error_msg", "Pleaselog in to view that resource");
    res.redirect("/admin/login");
  },
  forwardAdminAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/admin/dashboard");
  },
  authUser : function (req, res, next) {
  if (req.user == null) {
    res.status(403)
    return res.send('You need to sign in');
  }
  next();
  },
  authRole : function (req, res, next)  {
    if (req.user.role !== 'admin') {
      return res.redirect('/admin/login');
    }
    next()
  },
  userRole : function (req, res, next)  {
    if (req.user) {
      if (req.user.role !== 'basic') {
/*        req.user = null;
*/      return res.redirect('/login');
    }
    next()
  }else if(!req.user){
    next()
    /*return res.redirect();*/
  }
  },
}

//    We exports these two functions So, other files can use/call them
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
/*module.exports = {
  authrole
}*/