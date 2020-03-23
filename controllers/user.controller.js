const express = require('express');
const bcrypt = require("bcryptjs");
const passport = require("passport");
const cookieparser = require('cookie-parser');
const async = require('async');
const jwt = require('jsonwebtoken'); // Import JWT Package
const secret = 'ApnaCodeAS'; // Create custom secret for use in JWT
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bodyparser   = require('body-parser');
const flash = require("connect-flash");
const passportLocalMongoose = require("passport-local-mongoose");

//passport configuration file
const User = require("../models/user");
require("../config/passport")(passport);
const { checkAuthenticated , forwardAuthenticated } = require('../config/auth');
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
    temporarytoken = jwt.sign({ name: name, email: email }, secret, { expiresIn: '24h' }); // Create a token for activating account through e-mail
      //  Create a New User
  const user = new User({
    name : req.body.name,
    email : req.body.email,
    //password : req.body.password
    password : hashpasswd,
    temporarytoken
    
  });
  const saveUser = await user.save(function(err){
  var smtpTransport = nodemailer.createTransport({
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
          'http://' + req.headers.host + '/index/ ' + '\n\n' +
          'If you did not request this, please ignore this email..\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success_msg', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    res.render('register',{ success_msg :'Account Confirmation link sent to your email, Please Click on the link to confirm your account'});    
    });
};
};


exports.loginuser = (req,res,next)=>{
  passport.authenticate('local', {
    successRedirect: "/index",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};


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

exports.activate =  function(req, res) {
    User.findOne({ temporarytoken: req.params.token }, function(err, user) {
      if (err) throw err; // Throw error if cannot login
     // var token = req.params.token; // Save the token from URL for verification 
      console.log(temporarytoken);
      // Function to verify the user's token
      jwt.verify(temporarytoken, secret, function(err, decoded) {
        if (err) {
            return res.render('register',{error : 'Activation token is invalid or has expired.'});
        } /*else if (!user) {
              return res.render('register',{error : 'Activation token is invalid or has expired.'});
        } */else {
          //user.temporarytoken = undefined; // Remove temporary token
          //user.active = true; // Change account status to Activated
          console.log(temporarytoken);
          // Mongoose Method to save user into the database
          user.save(function(err) {
            if (err) {
              console.log(err); // If unable to save user, log error info to console/terminal
            } else {
               var smtpTransport = nodemailer.createTransport({
                service: 'gmail', 
                auth: {
                  user: 'usmanarshad864@gmail.com', 
                  pass: 'bismilla786786'
                }
                 });
              // If save succeeds, create e-mail object
              var email = {
                from: 'Localhost Staff, usmanarshad864@gmail.com',
                to: user.email,
                subject: 'Localhost Account Activated',
                text: 'Hello ' + user.name + ', Your account has been successfully activated!',
                html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Your account has been successfully activated!'
              };
              console.log(email);
               // send mail with defined transport object
              smtpTransport.sendMail(email, (error, info) => {
                  if (error) {
                      return console.log(error);
                  }
                  console.log("Account activated!");
                return res.render('login',{success_msg : 'Account Activated Successfully, Please Login '});
            });
          };
        });
      };
    });
  });
};
