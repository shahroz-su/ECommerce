const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/user_controller');
const userS = require('../models/user');
const ProDuct = require("../models/product");
const { checkAuthenticated , forwardAuthenticated } = require('../config/auth');
router.use(bodyparser.urlencoded({extended: false})); // get information from html forms


router.use(express.static(__dirname+"./public/"));
const Storage = multer.diskStorage({
	destination : "./public/images",
	filename:(req,file,cb)=>{
		cb(null,file.img+"_"+Date.now()+path.extname(file.originalname));
	}
});
const upload = multer({
	storage : Storage
}).single('img');

router.get('/',(req,res)=>{
	res.render("dashboard");
});
router.get('/dashboard',(req,res)=>{
	res.render("dashboard");
});

router.get('/user', (req,res)=>{
	res.redirect('/api/admin/all');
});
router.get('/user_sign', (req,res)=>{
	res.render('user_sign');
});
router.get('/register', (req,res)=>{
	res.render('user_sign');
});
router.get('/detail', (req,res)=>{
	res.redirect('/api/admin/all');
});
router.get('/delete', (req,res)=>{
	res.redirect('/api/admin/all');
});
router.get('/add_Product1', (req,res)=>{
	res.render('add_Product1');
});
router.get('/pro_add', (req,res)=>{
	res.render('add_Product1');
});
router.get('/show_pro',(req,res)=>{
	ProDuct.find(function(err,result){
		if (err) throw err;
	res.render("show_pro", { product : result });	
	})
});


router.post('/register' ,userController.register);
router.get('/all', userController.all);
router.post('/detail',userController.details);
router.get('/update/:id',userController.update);
router.get('/delete/:id',userController.delete);
router.post('/updateone',userController.updateone);

router.get('/autocomplete/',userController.autocomplete);
router.get('/autocompletes/',userController.autocompletes);
router.get('/autocompletee/',userController.autocompletee);

router.get('/product',userController.pro_all);
router.post('/pro_detail',userController.pro_details);
router.post('/pro_add',upload,userController.pro_add);
router.post('/pro_search',userController.pro_search);
module.exports = router;