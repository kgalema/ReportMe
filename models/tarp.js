const mongoose = require("mongoose")

// ================
// Redpanels Schema
// ================
const redpanelSchema = new mongoose.Schema({
	panel: { type: String, required: true },
	trigger: String,
	reportNumber: String,
	issueDate: { type: Date },
	fileID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Reds.files"
	},
	declaredDate: { type: Date },
	// issuedReport: { type: String },
	// issuedReport: {
	// 	data: Buffer,
	// 	contentType: String
	// },
	created: { type: Date, default: Date.now },
	section: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Section"
		},
		name: String
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
})

const Redpanel = mongoose.model("Redpanel", redpanelSchema)

module.exports = Redpanel

