const mongoose = require('mongoose');
const product = require("../models/product");

//Connect To DB
require('../config/db.js');

var products = [
	new product({
	imgpath : '/images/mk.jpg',
	name : 'Samsung S6 edge Plus ',
	company : 'Samsung',
	price : '$ 200'
	}),
	new product({
	imgpath : '/images/mk.jpg',
	name : 'Samsung S6 edge Plus ',
	company : 'Samsung',
	price : '$ 200'
	}),
	new product({
	imgpath : '/images/mk.jpg',
	name : 'Samsung S6 edge Plus ',
	company : 'Samsung',
	price : '$ 200'
	}),
];
var done = 0;
for (var i = 0; i < products.length; i++){
	products[i].save((err,result)=>{
	done++;
	if(done === products.length){
	exit();
	}
	});
}
function exit(){
	mongoose.disconnect();
}