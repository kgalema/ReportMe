const mongoose = require("mongoose")

// ================
// Redpanels Schema
// ================
const redpanelSchema = new mongoose.Schema({
	panel: String,
	trigger: String,
	reportNumber: String,
	issueDate: {type: Date},
	issuedReport: {},
	declaredDate: {type: Date},
	created: {type: Date, default: Date.now},
	section: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Section"
		},
		name: String
	}
})

const Redpanel = mongoose.model("Redpanel", redpanelSchema)

module.exports = Redpanel

