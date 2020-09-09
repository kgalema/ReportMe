const mongoose = require("mongoose")


// ====================
// SupportPanels Schema
// ====================
const supportSchema = new mongoose.Schema({
	panel: String,
	quantity: String,
	section: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Section"
		},
		name: String
	},

	created: {type: Date, default: Date.now}
})

const Support = mongoose.model("Support", supportSchema)
module.exports = Support
