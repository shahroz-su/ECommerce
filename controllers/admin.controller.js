const bcrypt = require("bcryptjs");
const passport = require("passport");
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const flash = require("connect-flash");
const bodyparser   = require('body-parser');
require("../config/passport")(passport);
// Load User model
const { authRole } = require('../config/auth');
const Admin = require("../models/admin");
const { ensureAdminAuthenticated ,registerValidation ,loginValidation, forwardAdminAuthenticated  } = require('../config/auth');
const ROLE = {
  ADMIN: 'admin',
  BASIC: 'basic'
}

exports.register_admin =  async (req,res) => {
  let err = [] ;
  let success_msg = [];
  const { name, email, password } = req.body;
  const { error } = registerValidation(req.body);
  if (error) return    res.status(400).send(error.details[0].message);

    //  Check if user is already exist in database or not
  const emailExist = await Admin.findOne({email : req.body.email});
  if (emailExist) {
    res.render('admin_register',{ err : "Email Already Exist, Please choose different" });
  }
  if (!emailExist){
  // Hash Password
    const salt = await bcrypt.genSalt(10 );
    const hashpasswd = await bcrypt.hash(req.body.password, salt);
      //  Create a New User
  const user = new Admin({
    name : req.body.name,
    role : ROLE.ADMIN,
    email : req.body.email,
    password : hashpasswd,
  });
  try{
    const saveUser = await user.save();
    return res.redirect('/admin/login');
  }catch(err){
    res.status(400).send(err);
  }
};
};


exports.loginadmin =  async (req,res,next) => {
  const { error } = loginValidation(req.body);
  if (error) return    res.status(400).send(error.details[0].message);
//  Check if user is  exist in database or not
Admin.findOne({email : req.body.email} , async function(err,user){
  if (!user) {
       err = "Email or Password is Incorrect";
      res.render('admin_login',{'err' : err});
  }
  if (user) {

        //  Its's Only Matched the Encrypted Password....
          const validPass = await bcrypt.compare(req.body.password,user.password);
          if (!validPass) {
            err = "Email or Password is Incorrect";
            res.render('admin_login',{'err' : err});
            }
          if (validPass) {
                    passport.authenticate('admin', {
                    successRedirect: "/admin/dashboard",
                    failureRedirect: "/admin/login",
                    failureFlash: true,
                  })(req, res, next);
              }
            }
});
};

// Logout already logined user
exports.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/admin/login");
};

exports.all = (req, res) => {
  Admin.find(function(err, result) {
    if (err) {
        err = "Sorry, No records Found";
       return res.render('admin_index',{ rest : result , 'err' : err});
    }if (!result) {
      res.render('admin_index',{rest : result , err : "No Record Found"});
    }
    if (result) {
    res.render('admin_index',{ rest : result });
    console.log(result);
    }
  });
};

exports.adminAdded =  async (req,res) => {
  let err = [] ;
  let success_msg = [];
  const { name, email, password } = req.body;
    //  Check if user is already exist in database or not
  const emailExist = await Admin.findOne({email : req.body.email});
  if (emailExist) {
    res.render('add_admin',{ err : "Email Already Exist, Please choose different" });
  }
  if (!emailExist){
  // Hash Password
    const salt = await bcrypt.genSalt(10 );
    const hashpasswd = await bcrypt.hash(req.body.password, salt);
      //  Create a New User
  const user = new Admin({
    name : req.body.name,
    role : ROLE.ADMIN,
    email : req.body.email,
    password : hashpasswd,
  });
  try{
    const saveUser = await user.save();
    return res.redirect('/admin/admin_index');
  }catch(err){
    console.log(err);
  }
};
};

exports.delete = async (req, res) => {
const id = { _id: req.params.id };
Admin.find((err,result)=>{
  if (result) {
      Admin.findByIdAndDelete( id ,(err,result)=>{
      if (err) {
           return res.render('admin_index',{ user : result , err : "Failed to delete record, try again" });
        }
      });   
  res.redirect('/admin/admin_index');
  }
  });
};   

exports.updated = async (req, res) => {
  const id = { _id: req.params.id };
  Admin.findById(id,function(err,result){
  if (err) throw err;
   res.render('update_admin',{ udte : result});
   console.log("update hony wala result : "+result);
     });
  };

exports.adminupdate = async (req, res) => {
  let err = [];
    const salt = await bcrypt.genSalt(10 );
    const hashpasswd = await bcrypt.hash(req.body.password, salt);
  name = req.body.name; 
  email = req.body.email; 
  password = hashpasswd;
  const all = {name , email , password} ;
  console.log(all);
  const hyy = { $set: all};
  const id =  req.body.id;
  Admin.findByIdAndUpdate(id, hyy ,function(err,result){
  if (err) {
    res.render('admin_index',{user : result , err : "Error during Update, please try again"});
  }
   res.redirect('/admin/admin_index');
     });
  //res.send(await userS.findById(req.params.id));
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
      Admin.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/admin/admin_forget');
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
          'http://' + req.headers.host + '/admin/admin_newpass/' + token + '\n\n' +
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
    res.render('admin_pass_reset1');
  });
};



/*============================================================================================================*/


exports.admin_newpass =  function(req, res) {
  let err = [] ;
  Admin.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      return res.render('admin_forget',{err : "Password reset token is invalid or has expired."});
    }
    res.render('admin_newpass', {token: req.params.token});
  });
};
/*============================================================================================================*/
exports.admin_newpasss =  async (req, res) => {
  let err = [] ;
Admin.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } } , async (err, user) => {
      if (err) throw err; // Throw error if cannot connect
      if (!user) {
          /*req.flash('error', 'Password reset token is invalid or has expired.');*/
          return res.render('admin_newpass', {token: req.params.token , err : "Password reset token is invalid or has expired."});
        }
      if (req.body.password == null || req.body.C_password == '') {
        /*req.flash('error', 'Password not Provided');*/
          return res.render('admin_newpass', {token: req.params.token , err : "Password not Provided."});
      }
      if (req.body.password  != req.body.C_password ) {
        /*req.flash('error', 'Password not match');*/
          return res.render('admin_newpass', {token: req.params.token , err : "Password not match"});
      } 
      else {
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
            res.redirect('/admin/login');
          }
        })
      }
    });
}