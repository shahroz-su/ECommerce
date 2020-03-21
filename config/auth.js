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
    }else{
      res.redirect("/api/web/index");
    }
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/api/web');      
  }
};

//    We exports these two functions So, other files can use/call them
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;