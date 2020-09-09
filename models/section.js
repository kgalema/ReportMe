const mongoose = require("mongoose")



// MONGOOSE/MODEL CONFIGURATION (Schema models)

// ==============
// Section Schema
// ==============
const sectionSchema = new mongoose.Schema({
	name: String,
	mineOverseer: String,
	created: {type: Date, default: Date.now},
	redPanels: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Redpanel"
		}
	],

	blastedPanels: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Blast"
		}
	],

	supportedPanels: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Support"
		}
	],

	cleanedPanels: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Clean"
		}
	]
})

const Section = mongoose.model("Section", sectionSchema)
module.exports = Section