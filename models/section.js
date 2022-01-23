const mongoose = require("mongoose")



// MONGOOSE/MODEL CONFIGURATION (Schema models)

// ==============
// Section Schema
// ==============
const opts = {
	toJSON: { virtuals: true },
	timestamps: true,
};

const sectionSchema = new mongoose.Schema({
	name: String,
	// mineOverseer: String,
	mineOverseer: {
		_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        name: String
	},
	budget: Number,
	forecast: Number,
	plannedAdvance: Number,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
}, opts);

const Section = mongoose.model("Section", sectionSchema)
module.exports = Section