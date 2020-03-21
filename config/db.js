const mongoose = require('mongoose');
//	Connect To DB
mongoose.connect('mongodb://localhost:27017/EmployeeDB',{useNewUrlParser: true },(err) =>{
	if (!err) {
		console.log("Connected to MongoDB");
	}else{
		console.log("Error in Connecting to DB "+err);
	}
});