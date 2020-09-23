const mongoose = require("mongoose")


// ====================
// BlastedPanels Schema
// ====================
const blastSchema = new mongoose.Schema({
	panel: String,
	quantity: String,
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


const Blast = mongoose.model("Blast", blastSchema)
module.exports = Blast