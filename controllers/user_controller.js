const _ = require("lodash");
const express = require('express');
var log = require('../lib/log.js');
var utils = require('../lib/utils.js');
var config = require('../config.json');
var pack = require('../package.json');
var path = require('path');
const userS = require('../models/user');
const productt = require("../models/product");

const bcrypt = require('bcryptjs');
const { productValidation , registerValidation, loginValidation } = require('../config/auth');
const flash = require("connect-flash");
var pdf = require('html-pdf');
var requestify = require('requestify');
const ROLE = {
  ADMIN: 'admin',
  BASIC: 'basic'
}



exports.register =  async (req,res) => {
  let err = [] ;
  let success_msg = [];
  const { name, email, password } = req.body;
console.log(req.body.name);
console.log(req.body.email);
console.log(req.body.password);
  const { error } = registerValidation(req.body);
  if (error) return    res.status(400).send(error.details[0].message);

    //  Check if user is already exist in database or not
  const emailExist = await userS.findOne({email : req.body.email});
  if (emailExist) {
    res.render('user_sign',{ err : "Email Already Exist, Please choose different" });
  }
  if (!emailExist){
  // Hash Password
    const salt = await bcrypt.genSalt(10 );
    const hashpasswd = await bcrypt.hash(req.body.password, salt);
      //  Create a New User
  const user = new userS({
    name : req.body.name,
    role : ROLE.BASIC,
    email : req.body.email,
    password : hashpasswd,
    active : true
  });
  try{
    const saveUser = await user.save();
    return res.redirect('user');
  }catch(err){
    res.status(400).send(err);
  }
};
};

exports.details = (req, res) => {
  
  const email = req.body.email;
  if (email != '') {
    const emailpra = {email : email}
  userS.find(emailpra, function(err, user) {
    if (err) {
      err = "Make sure you enter correct email";
       return res.render('users',{ user : user , 'err' : err});
    }
    if (user) {
      console.log(user);
    res.render('users',{user : user});
    }
  });
};
};

exports.all = (req, res) => {
  userS.find(function(err, result) {
    if (err) {
        err = "Sorry, No records Found";
       return res.render('users',{ user : result , 'err' : err});
    }if (!result) {
      res.render('users',{user : result , err : "No Record Found"});
    }
    if (result) {
    res.render('users',{user : result});
    console.log(result);
    }
  });
};

exports.update = async (req, res) => {
  const id = { _id: req.params.id };
  userS.findById(id,function(err,result){
  if (err) throw err;
   res.render('update',{ udte : result});
   /*console.log("update hony wala result : "+result);*/
     });
  };

exports.updateone = async function(req, res)  {
   let err = [];
    const salt = await bcrypt.genSalt(10 ) ;
    const hashpasswd = await bcrypt.hash(req.body.password, salt);
  name = req.body.name; 
  email = req.body.email; 
  password = hashpasswd;
userS.findOne({email : req.body.email},function(err,user){

/*      console.log(user);
      console.log(user.password);
      console.log(req.body.password);*/

      if (user.password == req.body.password) {
            const all = {name , email } ;
            console.log(all);
            const hyy = { $set: all};
            const id =  req.body.id;
            userS.findByIdAndUpdate(id, hyy ,function(err,result){
            if (err) {
              res.render('users',{user : result , err : "Error during Update, please try again"});
            }
             res.redirect('/admin/all');
               });
      }
      if (user.password != req.body.password) { 
            const all = {name , email , password} ;
            console.log(all);
            const hyy = { $set: all};
            const id =  req.body.id;
            userS.findByIdAndUpdate(id, hyy ,function(err,result){
            if (err) {
              res.render('users',{user : result , err : "Error during Update, please try again"});
            }
             res.redirect('/admin/all');
               });
      }
    });
  };


exports.delete = async (req, res) => {
const id = { _id: req.params.id };
userS.find((err,result)=>{
  if (result) {
      userS.findByIdAndDelete( id ,(err,result)=>{
      if (err) {
           return res.render('users',{ user : result , err : "Failed to delete record, try again" });
        }
/*        res.render('users',{user : result , err : "Record deleted Successfully.." });*/
      });   
  res.redirect('/admin/user');
 /* return res.render('users',{user : result , err : "Record deleted Successfully.." });*/
  }
  });
};   

exports.autocomplete = async (req,res)=>{
  const regex = new RegExp(req.query["term"],"i");

   const email = req.body.email;
  if (email != '') {
    const namepra = {email : regex}
  userS.find(namepra, function(err, result) {
 /*   console.log(result);*/
    const data = [];
    if (err) {
      return res.status(400).json({
        err: `Oops something went wrong! Can't find User with ${namepra}.`
      });
    }
    if (!err) {
      if (result && result.length && result.length>0) {
        result.forEach(user=>{
          let obj = {
            id : user._id,
            label : user.email
          };
          data.push(obj);
        });
      }
      res.jsonp(data);
    }
  });
};
};

exports.autocompletes = async (req,res)=>{
  const regex = new RegExp(req.query["term"],"i");

   const name = req.body.name;
  if (name != '') {
    const namepra = {name : regex}
  productt.find(namepra, function(err, result) {
 /*   console.log(result);*/
    const data = [];
    if (err) {
      return res.status(400).json({
        err: `Oops something went wrong! Can't find User with ${namepra}.`
      });
    }
    if (!err) {
      if (result && result.length && result.length>0) {
        result.forEach(user=>{
          let obj = {
            id : user._id,
            label : user.name
          };
          data.push(obj);
        });
      }
      res.jsonp(data);
    }
  });
};
};

exports.autocompletee = async (req,res)=>{
  const regex = new RegExp(req.query["term"],"i");

   const search = req.body.search;
  if (search != '') {
    const namepra = {search : regex}
  productt.find(namepra, function(err, result) {
 /*   console.log(result);*/
    const data = [];
    if (err) {
      return res.status(400).json({
        err: `Oops something went wrong! Can't find User with ${namepra}.`
      });
    }
    if (!err) {
      if (result && result.length && result.length>0) {
        result.forEach(user=>{
          let obj = {
            id : user._id,
            label : user.name
          };
          data.push(obj);
        });
      }
      res.jsonp(data);
    }
  });
};
};
exports.pro_add =  async (req,res) => {
const { name ,img , company ,price} = req.body;
 let err = [];
    const imgfile = req.file.filename;
 if (!name || !imgfile || !company || !price ) {
  err = "Please Fill All Fields";
    res.render('add_Product1',{'err' : err});
    } else {
    productt.findOne({ name: name }).then(pro =>{
      if (pro) {
        err = "Product Already Exist";
        res.render("add_Product1", { 'err' : err});
      } else {
        const product = new productt({
            name : req.body.name,
            imgname : imgfile,
            Company : req.body.company,
            price : req.body.price
          });
              product.save();
                res.redirect("show_pro");
              };
            });
};
 }; 


exports.pro_all = (req, res) => {
  productt.find(function(err, result) {
    if (err) {
      return res
        .status(400)
        .json({ err: "Oops something went wrong! Cannont find Products." });
    }
    /*console.log(result);*/
    res.render('show_pro',{product : result});
  });
};

exports.pro_details = (req, res) => {
 
  const name = req.body.name;
  if (name != '') {
    const emailpra = {name : name}
  productt.find(emailpra, function(err, user) {
    if (err) {
      err = "Make sure you enter correct email";
       return res.render('show_pro',{ product : user , 'err' : err});
    }
    if (user) {
      console.log(user);
    res.render('show_pro',{product : user});
    }
  });
};

};

exports.pro_delete = async (req, res) => {
const id = { _id: req.params.id };
productt.find((err,result)=>{
  if (result) {
      productt.findByIdAndDelete( id ,(err,result)=>{
      if (err) {
           return res.render('show_pro',{ product : result , err : "Failed to delete record, try again" });
        }
/*        res.render('users',{user : result , err : "Record deleted Successfully.." });*/
      });   
  res.redirect('/admin/product');
 /* return res.render('users',{user : result , err : "Record deleted Successfully.." });*/
  }
  });
};  

exports.update_pro = async (req, res) => {
  const id = { _id: req.params.id };
  productt.findById(id,function(err,result){
  if (err) throw err;
   res.render('update_product',{ prodct : result});
   console.log("Result : "+result);
     });
  };

exports.updateone_pro = async (req, res) => {
  let err = [];
const { name , company ,price} = req.body;
  const imgfile = req.file.filename;
  console.log(imgfile);
 if (name != '' && imgfile != '' && company != '' && price != '' ) {
  console.log(imgfile);
  const all = {name , imgfile , company , price } ;
  console.log(all);
   productt.findByIdAndUpdate(req.body.id, { 
     name : req.body.name,
      imgname : imgfile,
        Company : req.body.company,
          price : req.body.price
   } ,function(err,result){
  if (err) {
    console.log(err);
   return res.render('update_product',{user : result , err : "Error during Update, please try again"});
    }
  return res.redirect('/admin/product');
     });

}

  //res.send(await userS.findById(req.params.id));
  };

exports.reports = (req,res)=>{
   userS.find(function(err, result) {
    if (err) {
        err = "Something went wrong, please try again..";
       return res.render('users',{ user : result , 'err' : err});
    }
    if (!result) {
      err = "Sorry, No records Found";
       return res.render('users',{ user : result , 'err' : err});
    }

    if (result) {
var externalURL= 'http://' + req.headers.host + '/admin/allrecord';
requestify.get(externalURL).then(function (response) {
   // Get the raw HTML response body
   var html = response.body ; 
   var config = {format: 'Letter'};
        pdf.create(html, config).toFile('./generated.pdf', function (err, result) {
            if (err) return console.log(err);
            else {
              var datafile = fs.readFileSync("./generated.pdf");
              res.header("content-type", "application/pdf");
              res.send(datafile);
            }
                  });
                });
  }
  });
}

