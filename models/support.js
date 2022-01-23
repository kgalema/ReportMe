const mongoose = require("mongoose")


// ====================
// SupportPanels Schema
// ====================
const supportSchema = new mongoose.Schema({
	panel: String,
	quantity: String,
	shift: String,
	section: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Section",
		},
		name: String,
	},

	created: { type: Date, default: () => new Date() },
});

const Support = mongoose.model("Support", supportSchema)
module.exports = Support
