const mongoose = require("mongoose")


// ==========================
// New TARP red panel Schema
// ==========================
const opts = {
	toJSON: { virtuals: true },
	timestamps: true
};

const newRedPanelSchema = new mongoose.Schema({
	panel: String,
	triggers: String,
	dateDeclared: Date,
	section: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Section",
		},
		name: String,
	},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	created: { type: Date, default: () => new Date() },
}, opts);

newRedPanelSchema.virtual("age").get(function () {
	const gap = new Date() - this.dateDeclared;

	const second = 1000;
	const minute = second * 60;
	const hour = minute * 60;
	const day = hour * 24;

	const textDay = Math.floor(gap / day);
	const textHour = Math.floor((gap % day) / hour);
	const textMinute = Math.floor((gap % hour) / minute);

	let redAge;
	if(textDay === 1 && textHour < 12){
		redAge = `${textDay} day ago`;
	} else if(textDay > 1){
		redAge = `${textDay} days ago`;
	} else if (textHour === 1 && textMinute < 30){
		redAge = `${textHour} hour ago`;
	} else if(textHour > 1){
		redAge = `${textHour} hours ago`;
	} else if(textMinute === 1){
		redAge = `${textMinute} minute ago`;
	} else if(textMinute > 1){
		redAge = `${textMinute} minutes ago`;
	} else {
		redAge = `Few seconds ago`;
	}
	return redAge;
});


const NewRedPanel = mongoose.model("NewRedPanel", newRedPanelSchema)
module.exports = NewRedPanel