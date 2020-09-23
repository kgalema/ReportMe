const mongoose = require("mongoose")


// ====================
// CleanedPanels Schema
// ====================
const cleanSchema = new mongoose.Schema({
	panel: String,
	quantity: String,
	advance: String,
	shift: String,
	section: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Section"
		},
		name: String
	},
	created: {type: Date, default: Date.now}
})

const Clean = mongoose.model("Clean", cleanSchema)
module.exports = Clean
