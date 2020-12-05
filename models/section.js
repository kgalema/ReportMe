const mongoose = require("mongoose")



// MONGOOSE/MODEL CONFIGURATION (Schema models)

// ==============
// Section Schema
// ==============
const sectionSchema = new mongoose.Schema({
	name: String,
	mineOverseer: String,
	created: { type: Date, default: Date.now },
	redPanels: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Redpanel"
		}
	],

	production: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Production"
		}
	],
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
})

const Section = mongoose.model("Section", sectionSchema)
module.exports = Section