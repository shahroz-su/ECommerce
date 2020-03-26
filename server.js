const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const compression = require("compression");
const csurf = require('csurf');
const cookieparser = require('cookie-parser');
const bodyparser   = require('body-parser');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

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
app.use(express.json());
app.use(express.urlencoded({extended : false})); //===============
app.use(cookieparser('secret')); // read cookies (needed for auth)
app.use(bodyparser.urlencoded({extended: false})); // get information from html forms
app.use(
  session({
    secret: "secret",
    maxAge : 360000,
    resave: true,
    saveUninitialized: true
  })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Connect flash
app.use(flash());
// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

const usr = require('./routes/user_route');
const web = require('./routes/web_route');
const admin = require('./routes/admin_route');

//	Route Middleware
app.use('/', usr);
app.use('/', web);
app.use('/admin', admin);

app.set('views', __dirname + '/views');
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