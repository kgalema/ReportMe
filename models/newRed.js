const mongoose = require("mongoose")


// ====================
// BlastedPanels Schema
// ====================
const newRedPanelSchema = new mongoose.Schema({
	panel: String,
	triggers: String,
	dateDeclared: Date,
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
		},
	},
	created: {type: Date, default: new Date()}

})


const NewRedPanel = mongoose.model("NewRedPanel", newRedPanelSchema)
module.exports = NewRedPanel