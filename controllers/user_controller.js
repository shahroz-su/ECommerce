const _ = require("lodash");
const express = require('express');
const userS = require('../models/user');
const productt = require("../models/product");
const bcrypt = require('bcryptjs');
const { productValidation , registerValidation, loginValidation } = require('../config/auth');
const flash = require("connect-flash");

exports.register =  async (req,res) => {
  const { name, email, password } = req.body;
console.log(req.body.name);
console.log(req.body.email);
console.log(req.body.password);
  const { error } = registerValidation(req.body);
  if (error) return    res.status(400).send(error.details[0].message);

    //  Check if user is already exist in database or not
  const emailExist = await userS.findOne({email : req.body.email});
  if (emailExist) return res.status(400).send("Email Already Exist");
  // Hash Password
    const salt = await bcrypt.genSalt(10 );
    const hashpasswd = await bcrypt.hash(req.body.password, salt);
      //  Create a New User
  const user = new userS({
    name : req.body.name,
    email : req.body.email,
    //password : req.body.password
    password : hashpasswd
  });
  try{
    const saveUser = await user.save();
    console.log(req.user);
    res.redirect('user');
  }catch(err){
    res.status(400).send(err);
  }
};

exports.details = (req, res) => {

  const email = req.body.email;
  if (email != '') {
    const emailpra = {email : email}
  userS.find(emailpra, function(err, user) {
    if (err) {
      return res.status(400).json({
        err: `Oops something went wrong! Can't find User with ${emailpra}.`
      });
    }
    res.render('users',{user : user});
  });
};
};

exports.all = (req, res) => {
  userS.find(function(err, result) {
    if (err) {
      return res
        .status(400)
        .json({ err: "Oops something went wrong! Cannont find Users." });
    }
    res.render('users',{user : result});
   /* console.log(result);*/
  });
};

exports.update = async (req, res) => {
  const id = { _id: req.params.id };
  userS.findById(id,function(err,result){
  if (err) throw err;
   res.render('update',{user : result});
     })
  //res.send(await userS.findById(req.params.id));
  };

exports.updateone = async (req, res) => {
  const hyy = { $set: req.body };
  const id = req.body.id;
  userS.findByIdAndUpdate(id,hyy,function(err,result){
  if (err) throw err;
   res.render('users',{user : result});
     });
  //res.send(await userS.findById(req.params.id));
  };


exports.delete = async (req, res) => {
    const id = { _id: req.params.id };
  userS.findByIdAndDelete( id ,(err,result)=>{
  if (err) throw err;
  res.render('users',{user : result});
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

  const namee = req.body.name;
  if (name != '') {
  const neeeeww = {name : /.*namee.*/ }
  productt.find(neeeeww , function(err, result) {
    if (err) {
      return res.status(400).json({
        err: `Oops something went wrong! Can't find User with ${namepra}.`
      });
    }
    res.render('show_pro',{product : result});
  });
};
};
exports.pro_search = (req, res) => {

  const search = req.body.search;
  console.log(search);
  if (search != '') {
  const neeeeww = {name : search }
  productt.find(neeeeww , function(err, result) {
    if (err) {
      return res.status(400).json({
        err: `Oops something went wrong! Can't find User with ${namepra}.`
      });
    }
    res.render('product',{products : result , user : req.user});
  });
};
};
/*exports.delete = async (req, res) => {
  const id = req.params.id;
  let usr = await userS.deleteOne({ _id:id });
  if (!usr)
    return res.status(400).json({
      err: `Oops something went wrong! Cannont delete user with ${req.params.id}.`
    });
  res.render('users',{user : result});
};

*/