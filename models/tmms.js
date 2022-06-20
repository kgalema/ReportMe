const mongoose = require("mongoose")


// ============
// TMMS Schema
// ============
const opts = {
	toJSON: { virtuals: true },
	timestamps: true,
};

const tmmSchema = new mongoose.Schema({
	parentCategory: {
		type: String,
	},
	category: {
		type: String,
		required: [true, "Category of asset cannot be blank"],
	},
	name: {
		type: String,
		unique: true,
		required: [true, "Name of TMM cannot be blank"],
	},
	availability: {
		type: Number,
		unique: true,
		required: [true, "Target availability cannot be blank"],
	},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	}
}, opts);

const TMM = mongoose.model("TMM", tmmSchema);
module.exports = TMM;
