const mongoose = require("mongoose")

// ====================
// Rehab panels Schema
// ====================
const rehabSchema = new mongoose.Schema({
	panel: String,
	trigger: String,
	reportNumber: String,
	issueDate: {type: Date},
	declaredDate: {type: Date},
	created: {type: Date, default: Date.now},
	rehabDate: {type: Date},
	section: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Section"
		},
		name: String
	},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	},
	authorRed: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	},
	// fileID: {
	// 	id: {
	// 		type: mongoose.Schema.Types.ObjectId,
	// 		ref: "Reds.files"
	// 		}
	// },
	fileID: { type: mongoose.Schema.Types.ObjectId}
})

const Rehab = mongoose.model("Rehab", rehabSchema)

module.exports = Rehab;