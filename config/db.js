const mongoose = require("mongoose");

const URI = 'mongodb+srv://asdi007:786@asadali@cluster0-cotik.mongodb.net/ECommerce?retryWrites=true&w=majority';

mongoose.connect(URI || 'mongodb://localhost/EmployeeDB' , { useNewUrlParser: true ,  useUnifiedTopology: true});

mongoose.connection.on('connected',()=>{
	console.log("Mongoose is Connected");
});