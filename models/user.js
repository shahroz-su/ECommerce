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
	hostname : [{
		type : [String],
		required : true,
	}],
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

userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});


userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
};

userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('users',userSchema);

// In EmployeeDB, A table was Creaed with name user & these attributes that was given above