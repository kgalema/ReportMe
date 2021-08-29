const mongoose = require("mongoose")


// ====================
// TMMS Schema
// ====================
const tmmSchema = new mongoose.Schema({
	category: {
		type: String,
		required: [true, "Category of TMM cannot be blank"],
	},
	name: {
		type: String,
		unique: true,
		required: [true, "Name of TMM cannot be blank"],
	},
	author: {
		id: {
    		type: mongoose.Schema.Types.ObjectId,
    		ref: "User",
		},
	},
	created: { type: Date, default: new Date() },
});

const TMM = mongoose.model("TMM", tmmSchema);
module.exports = TMM;
