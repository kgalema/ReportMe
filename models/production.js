const mongoose = require("mongoose");

const opts = {
	toJSON: { virtuals: true },
	timestamps: true,
};

const productionSchema = new mongoose.Schema(
	{
		general: [
			{
				shift: String,
				shiftStart: Date,
				comments: String,
				isProduction: Boolean,
			},
		],
		blast: [
			{
				panel: String,
				length: Number,
				isCleaned: { type: Boolean, default: false },
				isMeasured: { type: Boolean, default: false },
				advance: Number,
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
		// fleetHrs: {
		// 	bolters: [
		// 		{
		// 			name: String,
		// 			engine: [Number],
		// 			drilling: [Number],
		// 			electrical: [Number]
		// 		}
		// 	],
		// 	drillRigs: [
		// 		{
		// 			name: String,
		// 			engine: [Number],
		// 			percussion: [Number],
		// 			electrical: [Number],
		// 		}
		// 	] ,
		// 	LHDs: [
		// 		{
		// 			name: String,
		// 			engine: [Number],
		// 		}
		// 	]
		// },
		section: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Section",
			},
			name: String,
			budget: { type: Number, default: 0 },
			forecast: { type: Number, default: 0 },
			plannedAdvance: Number,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		uniqueCode: { type: String, unique: true },
		declaration: {
			isAttached: { type: Boolean, default: false },
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "declarations.files",
			},
			author: String,
			authorID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
			date: { type: Date },
		},
	},
	opts
);

productionSchema.virtual("blasted").get(function () {
	if (this.blast) {
		const SQMBlasted = this.blast.map(e => e.length * e.advance).reduce((a, b) => a + b, 0);
		return SQMBlasted;
	}
	return 0;
});

productionSchema.virtual("blastedm").get(function () {
	if (this.blast) {
		const metersBlasted = this.blast.map(e => e.length).reduce((a, b) => a + b, 0);
		return metersBlasted;
	}
	return 0;
});

productionSchema.virtual("cleaned").get(function () {
	if (this.clean) {
		const metersCleaned = this.clean.map(e => e.length).reduce((a, b) => a + b, 0);
		return metersCleaned;
	}
});

productionSchema.virtual("supported").get(function () {
	if (this.support) {
		const metersSupported = this.support.map(e => e.length).reduce((a, b) => a + b, 0);
		return metersSupported;
	}
});

productionSchema.virtual("supportedBolts").get(function () {
	if (this.support) {
		const bolts = this.support.map(e => e.bolts).reduce((a, b) => a + b, 0);
		const anchors = this.support.map(e => e.anchors).reduce((a, b) => a + b, 0);
		return { bolts, anchors };
	}
});

productionSchema.virtual("drilled").get(function () {
	if (this.drill) {
		const metersDrilled = this.drill.map(e => e.length).reduce((a, b) => a + b, 0);
		return metersDrilled;
	}
});

productionSchema.virtual("drilledHoles").get(function () {
	if (this.drill) {
		const drilledHoles = this.drill.map(e => e.holes).reduce((a, b) => a + b, 0);
		return drilledHoles;
	}
});

productionSchema.virtual("prepared").get(function () {
	if (this.prep) {
		const metersPrepared = this.prep.map(e => e.length).reduce((a, b) => a + b, 0);
		return metersPrepared;
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

productionSchema.virtual("var").get(function () {
	const blastVariance = this.section.forecast;
	return blastVariance;
});

const Production = mongoose.model("Production", productionSchema);
module.exports = Production;
