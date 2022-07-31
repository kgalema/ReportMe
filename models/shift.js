const mongoose = require("mongoose");

// ====================
// Shift Schema
// ====================
const opts = {
	toJSON: { virtuals: true },
	timestamps: true,
};

const shiftSchema = new mongoose.Schema({
	name: String,
	start: String,
	end: String,
	duration: Number,
	overlap: Boolean,
	isBlasting: Boolean,
	authorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
}, opts);


const Shift = mongoose.model("Shift", shiftSchema);
module.exports = Shift;
