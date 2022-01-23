const mongoose = require("mongoose");

// ====================
// Breakdows Schema
// ====================
const opts = {
    toJSON: { virtuals: true },
    timestamps: true
};

const breakdownSchema = new mongoose.Schema({
    category: String,
    equipment: String,
    sapNumber: Number,
    description: String,
    startTime: Date,
    shift: String,
    section: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
        },
        name: String
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    created: { 
        type: Date,
        default: () => new Date()
    },
}, opts);

breakdownSchema.virtual("start").get(function () {
	const startTimeHours = this.startTime.getHours().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
	const startTimeMins = this.startTime.getMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });

	const start = `${startTimeHours}:${startTimeMins}`;
	return start;
});

const Breakdown = mongoose.model("Breakdown", breakdownSchema);
module.exports = Breakdown;
