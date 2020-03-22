const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const passport = require("passport");

const app = express();
const port = process.env.PORT || 3000;
//Connect To DB
require('./config/db.js');
//passport configuration file
require("./config/passport")(passport);

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
app.use(express.static(path.join(__dirname,'public')));

app.listen(port, () => {
	console.log("Server Started" + port);
});