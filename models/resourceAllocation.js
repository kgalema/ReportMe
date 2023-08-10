const mongoose = require("mongoose");

const opts = {
	toJSON: { virtuals: true },
	timestamps: true,
};

const resourceSchema = new mongoose.Schema(
	{
		LHDs: [String],
		drillRigs: [String],
		bolters: {
			type: [String],
		},
		shift: String,
		date: Date,
		uniqueCode: {
			type: String,
			unique: true,
		},
		section: {
			type: String,
			required: true,
			ref: "Section",
		},
		author: {
			_id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
		},
	},
	opts
);

const Resource = mongoose.model("Resource", resourceSchema);
module.exports = Resource;
