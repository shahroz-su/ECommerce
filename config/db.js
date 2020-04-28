const mongoose = require("mongoose");

const URI = 'mongodb+srv://asdi007:786@asadali@cluster0-cotik.mongodb.net/ECommerce?retryWrites=true&w=majority';

mongoose.connect(URI || 'mongodb://localhost:27017/EmployeeDB' , { useNewUrlParser: true ,  useUnifiedTopology: true});

mongoose.connection.on('connected',()=>{
	console.log("Mongoose is Connected");
});


/*
const mongoose = require('mongoose');
//	Connect To DB
mongoose.connect('mongodb://localhost:27017/EmployeeDB',{useNewUrlParser: true },(err) =>{
	if (!err) {
		console.log("Connected to MongoDB");
	}else{
		console.log("Error in Connecting to DB "+err);
	}
});*/