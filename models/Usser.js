const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true,
		min: 5
	},
	email : {
		type : String,
		required : true,
		max : 200,
		min : 10
	},
    Subscribed : { type : Boolean,required:true , default:false},
	date : {
		type : Date,
		default : Date.now
	}
});

userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('subscription',userSchema);

// In EmployeeDB, A table was Creaed with name user & these attributes that was given above