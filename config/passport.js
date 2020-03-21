const localstrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/user');


module.exports = function(passport){
passport.use(new localstrategy({usernameField : 'email' },(email , password , done)=>{
  User.findOne({email : email},(err,data)=>{
    if (err) throw err;
    if (!data) {
      return done(null, false,{message : "Email or password is incorrect"}); }
      // To Pass Here A Message use Flash later
      bcrypt.compare(password,data.password,(err,match)=>{
        if (err) {return done(null , false);}
        if (!match) { return done(null , false,{message : "Email or password is incorrect"});}
        if (match) { return done(null , data,{message : "Successfully Login"});}
      });
  });
}));
// Serialize & Deseralize user for creating sessions & Cookies
passport.serializeUser(function(user,cb){
  cb(null , user.id);
});


passport.deserializeUser(function(id,cb){
  User.findById(id,function(err,user){
    cb(err,user);
  });
});
};

