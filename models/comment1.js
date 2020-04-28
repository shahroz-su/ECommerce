const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true,
	},
	commentTxt : {
		type : String,
		required : true,
	},
	date : {
		type : Date,
		default : Date.now
	}
});
module.exports = mongoose.model('comments1',CommentSchema);
