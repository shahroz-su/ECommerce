const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true,
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
    active : { type : Boolean,required:true , default:false},
    Subscribed : { type : Boolean,required:true , default:false},
    temporary : String,
	date : {
		type : Date,
		default : Date.now
	}
});

userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('users',userSchema);

// In EmployeeDB, A table was Creaed with name user & these attributes that was given above