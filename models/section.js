const mongoose = require("mongoose")



// MONGOOSE/MODEL CONFIGURATION (Schema models)

// ==============
// Section Schema
// ==============
const opts = {
	toJSON: { virtuals: true },
	timestamps: true
};

const sectionSchema = new mongoose.Schema({
	name: String,
	mineOverseer: {
	_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		name: String,
	},
	budget: Number,
	forecast: Number,
	plannedAdvance: Number,
	meetingDuration: String,
	EEEDuration: String,
	travelingTime: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
}, opts);

sectionSchema.virtual("unusableTime").get(function () {
	const EEEHours = Number(this.EEEDuration.split(":")[0]);
	const EEEMinutes = (Number(this.EEEDuration.split(":")[1]));
	const travelingHours = Number(this.travelingTime.split(":")[0]);
	const travelingMinutes = (Number(this.travelingTime.split(":")[1]))
	const safetyMeetingHours = Number(this.meetingDuration.split(":")[0]);
	const safetyMeetingMinutes = (Number(this.meetingDuration.split(":")[1]));
	function add3Times(a, b, c){
		const totalMinutes = a + b + c;
		const divider = Math.floor(totalMinutes / 60);
		let hour = 0;
		let minutes = a + b + c;
		if(totalMinutes > 60){
			for(let i = 0; i < divider; i++){
				hour ++;
				minutes = minutes - 60
			}
		}
		
		const time = [hour, minutes];
		return time;
	}
	const extraHours = add3Times(EEEMinutes, travelingMinutes, safetyMeetingMinutes);
	const unusableHours = EEEHours + travelingHours + safetyMeetingHours + extraHours[0];
	const unusableMinutes = add3Times(EEEMinutes, travelingMinutes, safetyMeetingMinutes);
	const unusableTime = `${unusableHours.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })}:${unusableMinutes[1].toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })}`;
	return unusableTime;
});

const Section = mongoose.model("Section", sectionSchema)
module.exports = Section