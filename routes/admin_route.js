const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const passport = require("passport");
const flash = require("connect-flash");
const userController = require('../controllers/user_controller');
const  adminController = require('../controllers/admin.controller');
const userS = require('../models/user');
const ProDuct = require("../models/product");
const admin = require("../models/admin");

const { authUser, authRole, ensureAdminAuthenticated , forwardAdminAuthenticated  } = require('../config/auth');


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

router.get('/login' ,(req,res)=>{
	res.render('admin_login');
});


router.get('/register_admin',(req,res)=>{
	res.render('admin_register');
});


router.get('/', ensureAdminAuthenticated ,authRole ,(req,res)=>{
	res.render("dashboard",{ user: req.user });
});
router.get('/dashboard',ensureAdminAuthenticated ,authRole ,(req,res)=>{
/*	console.log("Login Details : " + req.user); //  Done */
	res.render("dashboard",{ user: req.user });
});

router.get('/user',ensureAdminAuthenticated,authRole , (req,res)=>{
	res.redirect('/admin/all');
});

router.get('/user_sign',ensureAdminAuthenticated,authRole , (req,res)=>{
	res.render('user_sign',{ user: req.user });
});
router.get('/register',ensureAdminAuthenticated,authRole , (req,res)=>{
	res.render('user_sign',{ user: req.user });
});
router.get('/detail',ensureAdminAuthenticated,authRole , (req,res)=>{
	res.render('users',{ user: req.user });
});
router.get('/update',ensureAdminAuthenticated,authRole ,(req,res)=>{
	res.render('update',{ user: req.user });
})
router.get('/delete',ensureAdminAuthenticated,authRole , (req,res)=>{
	res.render('users',{  user: req.user  });
});
router.get('/add_Product1',ensureAdminAuthenticated,authRole , (req,res)=>{
	res.render('add_Product1',{ user: req.user });
});
router.get('/pro_add',ensureAdminAuthenticated,authRole , (req,res)=>{
	res.render('add_Product1',{  user: req.user  });
});
router.get('/show_pro',ensureAdminAuthenticated,authRole ,(req,res)=>{
	ProDuct.find(function(err,result){
		if (err) throw err;
	res.render("show_pro", { product : result ,  user: req.user  });	
	})
});

router.get('/add_admin',ensureAdminAuthenticated,authRole , (req,res)=>{
	res.render('add_admin',{  user: req.user  });
});

router.post('/register' ,ensureAdminAuthenticated,authRole , userController.register);
router.get('/all',ensureAdminAuthenticated ,authRole ,  userController.all);
router.post('/detail',ensureAdminAuthenticated,authRole , userController.details);
router.get('/update/:id',ensureAdminAuthenticated,authRole , userController.update);
router.get('/delete/:id',userController.delete);
router.post('/updateone',userController.updateone);

router.get('/autocomplete/',ensureAdminAuthenticated,authRole , userController.autocomplete);
router.get('/autocompletes/',ensureAdminAuthenticated,authRole , userController.autocompletes);
router.get('/autocompletee/',ensureAdminAuthenticated,authRole , userController.autocompletee);

router.get('/product',ensureAdminAuthenticated,authRole , userController.pro_all);
router.post('/pro_detail',ensureAdminAuthenticated,authRole , userController.pro_details);
router.post('/pro_add',ensureAdminAuthenticated,authRole , upload ,userController.pro_add);
router.get('/pro_delete/:id',ensureAdminAuthenticated,authRole ,userController.pro_delete);
router.get('/update_pro/:id' ,ensureAdminAuthenticated,authRole ,userController.update_pro);
router.post('/update_pro', upload ,userController.updateone_pro);

/*authrole('admin'),*/
router.get("/admin_index", ensureAdminAuthenticated,authRole , adminController.all);
router.get('/logout',ensureAdminAuthenticated,authRole ,adminController.logout);
router.post('/login',adminController.loginadmin);
router.post('/register_admin', adminController.register_admin);
router.post('/adminAdded',ensureAdminAuthenticated,authRole , adminController.adminAdded);
router.get('/dell_admin/:id',ensureAdminAuthenticated,authRole, adminController.delete);
router.get('/update_admin/:id',ensureAdminAuthenticated,authRole, adminController.updated);
router.post('/admin_update',ensureAdminAuthenticated,authRole,adminController.adminupdate);
router.get('/admin_forget',(req,res)=>{
	res.render('admin_forget');
});
router.post('/admin_forget', adminController.forget);
router.get('/admin_newpass/:token',adminController.admin_newpass);
router.post('/admin_newpasss/:token',adminController.admin_newpasss);
router.get('update_admin',(req,res)=>{
	res.redirect('/admin/update_admin');
});

/*router.post('/pro_search',ensureAdminAuthenticated , userController.pro_search);*/

router.get('/report',ensureAdminAuthenticated , userController.reports);
router.get('/allrecord' , (req,res)=>{
	userS.find(function(err, result) {
		if (err) throw err;
	res.render('allrecord',{user : result });
});
});
module.exports = router;