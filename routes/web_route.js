const express = require("express");
const router = express.Router();
const { checkAuthenticated , forwardAuthenticated } = require('../config/auth');
const userController = require('../controllers/user.controller');
const Product = require("../models/product");
const csurf = require('csurf');
const cookieparser = require('cookie-parser');
const bodyparser   = require('body-parser');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

require("../config/passport")(passport);
/*const csrfMiddleware = csurf({
  cookie: true
});
router.use(csrfMiddleware);*/
router.use(express.json());
router.use(express.urlencoded({extended : false})); //===============
router.use(cookieparser('secret')); // read cookies (needed for auth)
router.use(bodyparser.urlencoded({extended: false})); // get information from html forms
router.use(session({resave: true, saveUninitialized: true, secret: 'SOMERANDOMSECRETHERE', cookie: { maxAge: 60000 }}));
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


// Dashboard
router.get('/',(req, res) => {
  console.log(req.user);
  console.log(req.cookies);
  console.log(req.session);
  res.render('index',{user : req.user , sess : req.session});
  });
router.get('/index',(req, res) =>{
  console.log(req.user);
  res.render('index',{user : req.user , sess : req.session});
  });
router.get('/about', (req, res) =>{
  console.log(req.user);
  res.render('about',{user : req.user , sess : req.session});
  });
router.get('/contact', (req, res) =>{
  console.log(req.user);
  res.render('contact',{user : req.user , sess : req.session , msg:''});
  });
router.get('/checkout', (req, res) =>{
  res.render('checkout',{user : req.user , sess : req.session});
  });
router.get('/faqs',  (req, res) =>{
  res.render('faqs',{user : req.user , sess : req.session});
  });
router.get('/help',  (req, res) =>{
  res.render('help',{user : req.user , sess : req.session});
  });
router.get('/payment', (req, res) =>{
  res.render('payment',{user : req.user , sess : req.session});
  });
router.get('/login' , (req, res) =>{
  res.render('login');
  });
router.get('/register', (req, res) =>{
  res.render('register');
  });
router.get('/pass-reset1', (req, res) =>{
  res.render('pass-reset1');
  });
router.get('/privacy', (req, res) =>{
  res.render('privacy',{user : req.user , sess : req.session});
  });
router.get('/product', function(req, res){
  Product.find(function(err,docs){
    if (err) throw err;
  res.render('product',{user : req.user , sess : req.session , products : docs });
  }); 
  });
router.get('/product2', (req, res) =>{
  res.render('product2',{user : req.user , sess : req.session})
  });
router.get('/single',  (req, res) =>{
  res.render('single',{user : req.user , sess : req.session});
  });
router.get('/single2', (req, res) =>{
  res.render('single2',{user : req.user , sess : req.session});
  });
router.get('/terms', (req, res) =>{
  res.render('terms',{user : req.user , sess : req.session});
  });

module.exports = router;