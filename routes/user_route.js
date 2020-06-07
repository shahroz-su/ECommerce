const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const cookieparser = require('cookie-parser');
const bodyparser   = require('body-parser');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const csurf = require('csurf');

// Load User model
const User = require("../models/user");
require("../config/passport")(passport);
const { userRole , checkAuthenticated , forwardAuthenticated } = require('../config/auth');
/*const csrfMiddleware = csurf({
  cookie: true
});
router.use(csrfMiddleware);*/
router.use(express.json());
router.use(express.urlencoded({extended : false})); //===============
router.use(cookieparser('secret')); // read cookies (needed for auth)
router.use(bodyparser.urlencoded({extended: false})); // get information from html forms
router.use(session({resave: true, saveUninitialized: true, secret: 'SOMERANDOMSECRETHERE', cookie: { maxAge: 3600000 }}));
// Passport middleware
router.use(passport.initialize());
router.use(passport.session());
// Connect flash
router.use(flash());
// Global variables
router.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

/*// Handle All Invalid Routes
router.get(‘*’, function(req, res){
 res.render("error");
});*/


router.post("/comment",userController.comment );
router.post("/comment1",userController.comment1 );
router.post("/comment2",userController.comment2 );

//Register Routes
router.get('/login' ,(req,res)=>{
  res.render("login");
});

router.get('/register',userController.register);

// Register
router.post('/register', userController.registeruser);

// Login
router.post('/login',userController.loginuser);

// Logout
router.get('/logout',userRole, userController.logout);

router.get('/forget', (req, res) =>{
  res.render('forget');
  });

router.post('/forget',userController.forget);

router.get('/newpass/:token',userController.newpass);
router.post('/newpasss/:token',userController.newpasss);

router.get('/send_msg',userRole,(req,res)=>{ 
  res.render('contact',{user : req.user , msg:''});
});
router.post('/send_msg',userController.send_msg);

//router.get('/activate/:temporarytoken',userController.activate);
router.get('/activate/:temporarytoken',userController.activate);

router.post('/device_verify_token',userController.verify_token)

module.exports = router;
