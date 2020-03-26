const express = require('express');
const bcrypt = require("bcryptjs");
const passport = require("passport");
const cookieparser = require('cookie-parser');
const async = require('async');
const _ =  require('lodash');
/*var secret = new Buffer('yoursecret', 'base64');*/
const jwt = require('jsonwebtoken'); // Import JWT Package
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bodyparser   = require('body-parser');
const flash = require("connect-flash");
const passportLocalMongoose = require("passport-local-mongoose");

//passport configuration file
const User = require("../models/user");
require("../config/passport")(passport);
const { loginValidation , checkAuthenticated , forwardAuthenticated } = require('../config/auth');
const app = express();

//Login Function

//Register Funcion
exports.register = (req, res) => res.render("register");

exports.registeruser = async (req,res)=>{
const { name, email, password } = req.body;
 let err = [];
 if (!name || !email || !password ) {
  err = "Please Fill All Fields";
res.render('register',{'err' : err, 'email' : email , 'name' : name , 'password' : password});
    }
   if (name.length < 5) {
    err = "Name must be at least 5 characters" ;
    res.render('register',{'err' : err, 'email' : email , 'name' : name , 'password' : password});
  }
   if (password.length < 6) {
    err = "Password must be at least 6 characters" ;
    res.render('register',{'err' : err, 'email' : email , 'name' : name , 'password' : password});
  }
  if (err.length > 0) {
    res.render("register", { 'err' : err, 'email' : email , 'name' : name , 'password' : password});
  } 
  const emailExist = await User.findOne({email : req.body.email});
  if (emailExist){
   err = "Email Already Exist";
   res.render('register',{'err' : err, 'email' : email , 'name' : name , 'password' : password});
 }else{
 	const salt = await bcrypt.genSalt(10 );
    const hashpasswd = await bcrypt.hash(req.body.password, salt);
    const user = new User(); // Create new User object
	user.name = req.body.name; // Save username from request to User object
	user.email = req.body.email; // Save email from request to User object
	user.password = hashpasswd;
  /*user : _.pick(user, 'id')*/
  /*id: user._id*/
  temporarytoken = jwt.sign({ id: user._id }, 'shhhhh', { expiresIn: '24h' }); 
	user.temporary = temporarytoken ;
    console.log(user);
      user.save(function(err) {
      	if (err) {
      		console.log(err);
      	}else{
			  var smtpTransport = nodemailer.createTransport({
			        host: 'smtp.gmail.com',
					port: 465,
					secure: true,
			        service : 'gmail',
			        auth: {
			          user: 'usmanarshad864@gmail.com', 
			          pass: 'bismilla786786'
			        }
			      });
			      var mailOptions = {
			        to: user.email,
			        from: 'Localhost Staff, usmanarshad864@gmail.com',
			        subject: 'Account Confirmation Link',
			        text: 
			          'Please click on the following link, to Confirm your Account:\n\n' +
			          'http://' + req.headers.host + '/activate/' + user.temporary + '\n\n' +
			          'If you did not request this, please ignore this email..\n'
			      };
			      smtpTransport.sendMail(mailOptions, function(err) {
			        console.log('mail sent');
              
			      });
			res.render('register',{ success_msg :'Account Registered But not yet Activated. Account Confirmation link sent to your ' + user.email + ' Please Click on the link to Activate your account'}); 
      	}
				});
}
};


exports.loginuser =  async (req,res) => {

  const { error } = loginValidation(req.body);
  if (error) return    res.status(400).send(error.details[0].message);

//  Check if user is  exist in database or not
User.findOne({email : req.body.email} , async function(err,user){
	if (!user) {
		   err = "Email or Password is Incorrect";
   		res.render('login',{'err' : err});
	}
	if (user) {
		if (!user.active) {
				err = "Account is Not yet Activated, Check your email to activate your account.";
		   		res.render('login',{'err' : err});
			}
			if(user.active){
				//  Its's Only Matched the Encrypted Password....
				  const validPass = await bcrypt.compare(req.body.password,user.password);
				  if (!validPass) {
				  	err = "Email or Password is Incorrect";
			   		res.render('login',{'err' : err});
			   		}
			   	if (validPass) {
			   		  jwt.sign({ _id : user._id } ,'secretkey', (err,token) => {
					    if (!err) {
					      res.header('Token',token);
					      res.render('index',{user : user});
					    }else{
					       err = "Something went Wrong, Tyr Again";
   							res.render('login',{'err' : err});
					    }
					  });
			   		}
			}
	}
});
};

/*
exports.loginuser = (req,res,next)=>{
  passport.authenticate('local', {
    successRedirect: "/index",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};*/


app.get('/index',checkAuthenticated,(req,res)=>{
  res.render('index',{user : req.user});
  console.log(req.user);
});

// Logout
//router.get('/logout', userController.logout);
exports.logout = (req,res)=>{
   req.logout();
  res.redirect("/index");
};


exports.forget = (req, res, next) => {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forget');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 36000000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
     var smtpTransport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
			 port: 465,
		secure: true,
        service : 'gmail',
        auth: {
          user: 'usmanarshad864@gmail.com', 
          pass: 'bismilla786786'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'usmanarshad864@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'https://mobie-store.herokuapp.com' + '/newpass/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        //req.flash('success_msg', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.render('pass-reset1');
  });
};


/*============================================================================================================*/


exports.newpass =  function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.render('forget');
    }
    res.render('newpass', {token: req.params.token});
  });
};
/*============================================================================================================*/
exports.newpasss =  async (req, res) => {
User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } } , async (err, user) => {
      if (err) throw err; // Throw error if cannot connect
      if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.render('newpass');
        }
      if (req.body.password == null || req.body.C_password == '') {
        req.flash('error', 'Password not Provided');
          return res.render('newpass');
      } else {
    const salt = await bcrypt.genSalt(10 );
    const hashpasswd = await bcrypt.hash(req.body.password, salt);
            user.password = hashpasswd; // Save user's new password to the user object
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
        //user.resettoken = false; // Clear user's resettoken 
        // Save user's new data
       const saveUser = await user.save(function(err) {
          if (err) {
            res.json({ success: false, message: err });
          } else {
            var smtpTransport = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
              user: 'usmanarshad864@gmail.com', 
              pass: 'bismilla786786'
            }
             });
            // Create e-mail object to send to user
            var email = {
              from: 'Localhost Staff, usmanarshad864@gmail.com',
              to: user.email,
              subject: 'Reset Password',
              text: 'Hello ' + user.name + ', This e-mail is to notify you that your password was recently reset at localhost.com',
              html: 'Hello<strong> ' + user.name + '</strong>,<br><br>This e-mail is to notify you that your password was recently reset at localhost.com'
            }
            console.log(email);
            // Function to send e-mail to the user
            smtpTransport.sendMail(email, function(err) {
              req.flash('success_msg', 'Success! Your password has been changed.');
              done(err);
            });
           /* res.json({ success: true, message: 'Password has been reset!' }); // Return success message*/
            res.redirect('/login');
          }
        })
      }
    });
}

exports.send_msg = (req,res)=>{
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
  service : 'gmail',
    auth: {
        user: 'usmanarshad864@gmail.com', // generated ethereal user
        pass: 'bismilla786786'  // generated ethereal password
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Nodemailer Contact" <usmanarshad864@gmail.com>', // sender address
      to: 'usmanarshad0072122@gmail.com', // list of receivers
      subject: 'Node Contact Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {user : req.user , msg:'Email has been sent'});
  });
  };

exports.activate = async function(req, res) {
User.findOne({ temporary : req.params.temporarytoken } , async function (err, user) {
const token = req.params.temporarytoken;
console.log(token);
/*const { user : { id }} =*/ jwt.verify(token, 'shhhhh', async (err, decoded) => {
      if (err) {
          console.log(err);
          err = "Activation Token is Invalid or Expired...";
            res.render('register', {'err' : err});
      }
        if (!token) {
          console.log(token);
          err = "Activation Token is Invalid or Expired...";
            res.render('register', {'err' : err});
      }
      if (!user) {
          console.log(token);
          err = "Activation Token is Invalid or Expired...";
            res.render('register', {'err' : err});
      }
      if (!decoded) {
        console.log(decoded);
          err = "Activation Token is Invalid or Expired...";
            res.render('register', {'err' : err});
            // Token may be valid but does not match any user in the database
      }if (decoded){
        console.log(user);
        console.log(decoded);
        console.log(decoded.id);
         user.active = true;
         user.temporary = false;
        /*await User.update({ active : true , temporary : false} , { where : { idd } });*/
          user.save(function(err) {
            if (err) {
              console.log(err); // If unable to save user, log error info to console/terminal
            } else {
                const smtpTransport = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                    service : 'gmail',
                    auth: {
                      user: 'usmanarshad864@gmail.com', 
                      pass: 'bismilla786786'
                    }
                  });
              // If save succeeds, create e-mail object
              var email = {
                from: 'Localhost Staff, staff@localhost.com',
                to: user.email,
                subject: 'Localhost Account Activated',
                text: 'Hello ' + user.name + ', Your account has been successfully activated!',
                html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Your account has been successfully activated!'
              };

              // Send e-mail object to user
               smtpTransport.sendMail(email, function(err) {
                if (err) console.log(err); // If unable to send e-mail, log error info to console/terminal
              });
                res.render('login',{ success_msg :'Account activated!.. Please Login'});  
            }
          });
      }
        });
      });
};