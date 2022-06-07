const mongoose = require("mongoose");

// ====================
// Closed Breakdows Schema
// ====================
const opts = { 
    toJSON: { virtuals: true },
    timestamps: true
};

const closedBreakdownSchema = new mongoose.Schema({
    endTime: Date,
    comments: String,
    artisan: String,
    breakdown: {},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    created: { type: Date, default: () => new Date() },
}, opts);

closedBreakdownSchema.virtual("downtime").get(function(){
    const diffMilSecs = this.endTime - this.breakdown.startTime;

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    
    const diffMins = Math.floor((diffMilSecs % hour) / minute).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
    const diffHours = Math.floor((diffMilSecs / hour)).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
    const downtime = `${diffHours}:${diffMins}`;
    return downtime
});

closedBreakdownSchema.virtual("start").get(function(){
    const startTimeHours = this.breakdown.startTime.getHours().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
	const startTimeMins = this.breakdown.startTime.getMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });

    const start = `${startTimeHours}:${startTimeMins}`
    return start;
});

closedBreakdownSchema.virtual("end").get(function(){
    const endTimeHours = this.endTime.getHours().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
    const endTimeMinutes = this.endTime.getMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });

    const end = `${endTimeHours}:${endTimeMinutes}`;
    return end;
});

const ClosedBreakdown = mongoose.model("ClosedBreakdown", closedBreakdownSchema);
module.exports = ClosedBreakdown;
