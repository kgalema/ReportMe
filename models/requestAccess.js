const mongoose = require("mongoose")


// ====================
// UserSchema Schema
// ====================
const opts = {
	toJSON: { virtuals: true },
	timestamps: true
};

const requestSchema = new mongoose.Schema({
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
	username: {
		type: String,
		unique: true,
		required: [true, "Username cannot be blank"],
	},
	isAdmin: { type: Boolean, default: false },
	isDischarged: { type: Boolean, default: false },
}, opts);



const Request = mongoose.model("Request", requestSchema);
module.exports = Request;