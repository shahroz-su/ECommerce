const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true,
	},
	imgname : {
		type : String,
		required : true,
	},
	Company : {
		type : String,
		required : true,
	},
	price : {
		type : String,
		required : true,
	},
	date : {
		type : Date,
		default : Date.now
	}
});
module.exports = mongoose.model('products',productSchema);

// In EmployeeDB, A table was Creaed with name user & these attributes that was given above