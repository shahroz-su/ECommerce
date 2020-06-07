const express = require("express");
const router = express.Router();
const path = require('path');
const mongoose = require("mongoose");
var favicon = require('serve-favicon');
const compression = require("compression");
const csurf = require('csurf');
var pack = require('../package.json');
const cookieparser = require('cookie-parser');
const bodyparser   = require('body-parser');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

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

const app = express();
const port = process.env.PORT || 3000;
//Connect To DB
require('./config/db.js');

//passport configuration file
require("./config/passport")(passport);
/*const csrfMiddleware = csurf({
  cookie: true
});
app.use(csrfMiddleware);*/

const usr = require('./routes/user_route');
const web = require('./routes/web_route');
const admin = require('./routes/admin_route');

//	Route Middleware
app.use('/', usr);
app.use('/', web);
app.use('/admin', admin);

app.set('views', __dirname + '/views');
// Use ICON for youe website
app.use(favicon(path.join(__dirname,'public/img/favicon.png')));

app.engine('ejs', require('ejs-locals',{extname : 'ejs', defaultlayout : 'main',
	layoutDir : __dirname+'/views/layouts',
	partialsDir  : [
        //  path to your partials
        path.join(__dirname, 'views/partials'),
    ] }));
app.set('view engine', 'ejs');

//	Set Static Folder
// Compression to increaase the response time
app.use(compression());
app.use(express.static(path.join(__dirname,'public')));

app.listen(port, () => {
	console.log("Server Started " + port);
});
