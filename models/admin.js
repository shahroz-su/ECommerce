const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");


const adminSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true,
		unique: true,
		min: 5
	},
	role : {
		type : String,
		required : true,
	},
email : {
		type : String,
		required : true,
		max : 200,
		unique: true,
		min : 10
	},
	password : {
		type : String,
		required : true,
		max : 200,
		min : 8
	},
	resetPasswordToken: String,
    resetPasswordExpires: Date,
	date : {
		type : Date,
		default : Date.now
	}
});

adminSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('Admin',adminSchema);

// In EmployeeDB, A table was Creaed with name user & these attributes that was given above