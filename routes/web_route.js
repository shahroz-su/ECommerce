const express = require("express");
const router = express.Router();
const { userRole,checkAuthenticated , forwardAuthenticated } = require('../config/auth');
const userController = require('../controllers/user.controller');
const Product = require("../models/product");
const csurf = require('csurf');
const cookieparser = require('cookie-parser');
const bodyparser   = require('body-parser');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const Comment = require("../models/comment");
const Comment1 = require("../models/comment1");
const Comment2 = require("../models/comment2");
var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://asdi007:786@asadali@cluster0-cotik.mongodb.net/ECommerce?retryWrites=true&w=majority';
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
// Handle All Invalid Routes
// Dashboard
/*router.get('/',(req, res) => {
    Comment.find(function(err,coo){
      if (err) throw err;
    if (coo) {
      res.render('index',{user : req.user , sess : req.session , comment : coo , subscr : req.sub  });
      console.log(coo);
      console.log(req.sub);
    }
  });
      });*/

router.get('/',userRole,(req, res) => {
    Comment.find(function(err,coo){
      if (err) throw err;
    if (coo) {
      res.render('index',{user : req.user , sess : req.session , comment : coo , subscr : req.sub  });
      console.log(coo );
      console.log(req.sub);
    }
  });
      });

router.get("/json", userController.AllJson);

router.get('/index',userRole,(req, res) =>{
    Comment.find(function(err,coo){
    if (err) {console.log(err)};
    if (coo) {
      res.render('index',{ user : req.user , sess : req.session , comment : coo , subscr : req.sub  });
      console.log("Login Details : " + req.user); //  Done                //  Done
/*      console.log("Comments Are : "+coo);         //  Done
      console.log("SubScription : " + req.sub);
*/
    }
  });
  });

router.get('/about',userRole, (req, res) =>{
  console.log(req.user);
  res.render('about',{user : req.user , sess : req.session  , subscr : req.sub});
  });
router.get('/contact',userRole, (req, res) =>{
  console.log(req.user);
  res.render('contact',{user : req.user , sess : req.session , msg:'' , subscr : req.sub});
  });
router.get('/checkout',userRole, (req, res) =>{
  res.render('checkout',{user : req.user , sess : req.session , subscr : req.sub});
  });
router.get('/faqs',userRole,  (req, res) =>{
  res.render('faqs',{user : req.user , sess : req.session , subscr : req.sub});
  });
router.get('/help',userRole,  (req, res) =>{
  res.render('help',{user : req.user , sess : req.session , subscr : req.sub});
  });
router.get('/payment',userRole, (req, res) =>{
  res.render('payment',{user : req.user , sess : req.session , subscr : req.sub});
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
router.get('/privacy',userRole, (req, res) =>{
  res.render('privacy',{user : req.user , sess : req.session , subscr : req.sub});
  });


router.get('/product',userRole, function(req, res){
  Product.find(function(err,docs){
    if (err) throw err;
    MongoClient.connect(url, function(err, db) {
       if (err) throw err;
      var dbc = db.db("ECommerce");
    dbc.collection("comments1").find().limit(4).toArray(function(err,result){
      if (err) throw err;
    if (result) {
      console.log(result);
      res.render('product',{user : req.user , sess : req.session , products : docs , comment : result , subscr : req.sub }); 
      console.log("Subscription : "+ req.sub);
    }
    if (!result) {
      res.render('product',{user : req.user , sess : req.session , products : docs , subscr : req.sub  });
      console.log("Subscription : "+ req.sub);
    }
      });
  }); 
  });
});

router.get('/product2',userRole, (req, res) =>{
   Comment2.find(function(err,result){
    if (err) throw err;
    if (result) {
      res.render('product2',{user : req.user , sess : req.session , comment : result , subscr : req.sub  });
      console.log(req.session);
    }
    if (!result) {
      res.render('product2',{user : req.user , sess : req.session , subscr : req.sub });
    }
      });
  });
router.get('/single',userRole,  (req, res) =>{
  res.render('single',{user : req.user , sess : req.session});
  });
router.get('/single2',userRole, (req, res) =>{
  res.render('single2',{user : req.user , sess : req.session});
  });
router.get('/terms',userRole, (req, res) =>{
  res.render('terms',{user : req.user , sess : req.session});
  });

router.post("/index",userController.Newletter);
router.post("/unsubscribe",userController.unsubscribe);


module.exports = router;