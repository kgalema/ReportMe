const mongoose = require("mongoose");

const opts = {
	toJSON: { virtuals: true },
	timestamps: true,
};

const productionSchema = new mongoose.Schema({
	general: [
		{
			shift: String,
			comments: String,
		},
	],
	blast: [
		{
			panel: String,
			length: Number,
		},
	],
	clean: [
		{
			panel: String,
			length: Number,
			advance: Number,
		},
	],
	support: [
		{
			panel: String,
			length: Number,
			bolts: Number,
			anchors: Number,
			machine: String,
		},
	],
	drill: [
		{
			panel: String,
			length: Number,
			holes: Number,
			drillRig: String,
		},
	],
	prep: [
		{
			panel: String,
			length: Number,
		},
	],
	notClean: [
		{
			panel: String,
			length: Number,
		},
	],
	LHD: [
		{
			coyNumber: Number,
			LHDnumber: String,
			buckets: Number,
		},
	],
	section: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Section",
		},
		name: String,
		budget: Number,
		forecast: Number,
		plannedAdvance: Number,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	uniqueCode: { type: String, unique: true },
	created: { type: Date, default: () => new Date() },
}, opts);

productionSchema.virtual("blasted").get(function () {
	// const startTimeHours = this.startTime.getHours().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
	// const startTimeMins = this.startTime.getMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
	const blastedPanels = this.blast;
	const achievesM = this.blast.map(pl => pl.length).reduce((a, b) => a + b, 0)
	const achievesSQM = (achievesM * this.section.plannedAdvance).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
	return achievesSQM;
});

productionSchema.virtual("forecast").get(function () {
	const forecast = this.section.forecast;
	return forecast;
});
productionSchema.virtual("budget").get(function () {
	const budget = this.section.budget;
	return budget;
});


const Production = mongoose.model("Production", productionSchema)
module.exports = Production