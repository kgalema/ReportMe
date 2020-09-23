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
	section: String,
	sectionid: {type: mongoose.Schema.Types.ObjectId},
	sectionid: String
	// section: {
	// 	id: {
	// 		type: mongoose.Schema.Types.ObjectId,
	// 		ref: "Section"
	// 	},
	// 	name: String
	// }
})

const Rehab = mongoose.model("Rehab", rehabSchema)

module.exports = Rehab;