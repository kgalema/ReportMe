const mongoose = require("mongoose");

const opts = {
	toJSON: { virtuals: true },
	timestamps: true,
};

const productionSchema = new mongoose.Schema({
	general: [
		{
			shift: String,
			shiftStart: Date,
			comments: String,
			isProduction: Boolean
		},
	],
	blast: [
		{
			panel: String,
			length: Number,
			isCleaned: {type: Boolean, default: false},
			isMeasured: {type: Boolean, default: false},
			advance: Number
		},
	],
	clean: [
		{
			panel: String,
			length: Number,
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
	fleetHrs: {
		bolters: [
			{
				name: String,
				engine: [Number],
				drilling: [Number],
				electrical: [Number]
			}
		],
		drillRigs: [
			{
				name: String,
				engine: [Number],
				percussion: [Number],
				electrical: [Number],
			}
		] ,
		LHDs: [
			{
				name: String,
				engine: [Number],
			}
		]
	},
	section: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Section",
		},
		name: String,
		budget: {type: Number, default: 0},
		forecast: {type: Number, default: 0},
		plannedAdvance: String
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	uniqueCode: { type: String, unique: true },
	created: { type: Date, default: () => new Date() },
}, opts);

productionSchema.virtual("blasted").get(function () {
	if(this.blast){
		const SQMBlasted = this.blast.map(e => e.length * e.advance).reduce((a, b) => a + b, 0);
		return SQMBlasted;
	}
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