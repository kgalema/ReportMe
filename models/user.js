const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")


// ====================
// UserSchema Schema
// ====================
const opts = {
	toJSON: { virtuals: true },
	timestamps: true
};

const userSchema = new mongoose.Schema({
	occupation: {
		type: String,
		required: [true, "Occupation not defined"],
	},
	department: {
		type: String,
		required: [true, "Department not defined"],
	},
	preferredName: {
		type: String,
		unique: true,
		required: [true, "Preferred name cannot be blank"],
	},
	isAdmin: { type: Boolean, default: false },
	isDischarged: { type: Boolean, default: false },
	resetPasswordToken: { type: String },
	resetPasswordExpires: { type: Date },
}, opts);


// This line adds on to our schema username and password and ensure that they are unique
userSchema.plugin(passportLocalMongoose)


const User = mongoose.model("User", userSchema)
module.exports = User