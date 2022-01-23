const mongoose = require("mongoose")

// ====================
// Rehab panels Schema
// ====================
const opts = {
	toJSON: { virtuals: true },
	timestamps: true,
};

const rehabSchema = new mongoose.Schema({
	panel: String,
	trigger: String,
	reportNumber: String,
	issueDate: { type: Date },
	declaredDate: { type: Date },
	rehabDate: { type: Date },
	section: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Section",
		},
		name: String,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	authorRed: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	authorNewRed: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},

	fileID: { type: mongoose.Schema.Types.ObjectId },
},opts);

const Rehab = mongoose.model("Rehab", rehabSchema)

module.exports = Rehab;