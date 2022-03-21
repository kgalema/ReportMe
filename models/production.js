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
	fleetHrs: {
		bolters: [
			{
				bolterId: String,
				engine: [Number],
				drilling: [Number],
				electrical: [Number]
			}
		],
		drillRigs: [
			{
				rigId: String,
				engine: [Number],
				percussion: [Number],
				electrical: [Number],
			}
		] ,
		LHD: [
			{
				LHDId: String,
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

productionSchema.virtual("LHDUsage").get(function () {
	const lhdHrs = this.fleetHrs.LHD;
	lhdHrs.forEach((e, i) => {
		const usage = e.engine[1] - e.engine[0];
		lhdHrs[i].usage = usage;
	})
	return;
});

productionSchema.virtual("drillRigUsage").get(function () {
	const drillRigsHrs = this.fleetHrs.drillRigs;
	drillRigsHrs.forEach((e, i) => {
		const engineUsage = e.engine[1] - e.engine[0];
		const percussionUsage = e.percussion[1] - e.percussion[0];
		const electricalUsage = e.electrical[1] - e.electrical[0];
		drillRigsHrs[i].engineUsage = engineUsage;
		drillRigsHrs[i].percussionUsage = percussionUsage;
		drillRigsHrs[i].electricalUsage = electricalUsage;
	})
	return;
});

productionSchema.virtual("bolterUsage").get(function () {
	const bolterHrs = this.fleetHrs.bolters;
	bolterHrs.forEach((e, i) => {
		const engineUsage = e.engine[1] - e.engine[0];
		const drillingUsage = e.drilling[1] - e.drilling[0];
		const electricalUsage = e.electrical[1] - e.electrical[0];
		bolterHrs[i].engineUsage = engineUsage;
		bolterHrs[i].drillingUsage = drillingUsage;
		bolterHrs[i].electricalUsage = electricalUsage;
	})
	return;
});


const Production = mongoose.model("Production", productionSchema)
module.exports = Production