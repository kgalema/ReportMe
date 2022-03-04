/*
 * Production calendar schema
 */

const mongoose = require("mongoose");


const opts = {
	toJSON: { virtuals: true },
	timestamps: true,
};


const productionCalendarSchema = new mongoose.Schema({
	date: {
		type: Date,
		unique: true,
		required: [true, "Production date cannot be blank"],
		
	},
	isProductionShift: {
        type: Boolean,
        default: true
    },
	author: {
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	}
}, opts);


const ProductionCalendar = mongoose.model("ProductionCalendar", productionCalendarSchema);
module.exports = ProductionCalendar;
