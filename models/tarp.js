const mongoose = require("mongoose")

// ================
// Redpanels Schema
// ================
const opts = {
	toJSON: { virtuals: true },
	timestamps: true
};

const redpanelSchema = new mongoose.Schema({
	panel: { type: String, required: true },
	trigger: String,
	reportNumber: String,
	issueDate: { type: Date },
	fileID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Reds.files",
	},
	declaredDate: { type: Date },
	created: { type: Date, default: () => new Date() },
	section: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Section",
		},
		name: String,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	newRedAuthor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
}, opts);

redpanelSchema.virtual("age").get(function () {
	const gap = new Date() - this.issueDate;

	const second = 1000;
	const minute = second * 60;
	const hour = minute * 60;
	const day = hour * 24;

	const textDay = Math.floor(gap / day);
	const textHour = Math.floor((gap % day) / hour);
	const textMinute = Math.floor((gap % hour) / minute);

	let redAge;
	if (textDay === 1 && textHour < 12) {
		redAge = `${textDay} day ago`;
	} else if (textDay > 1) {
		redAge = `${textDay} days ago`;
	} else if (textHour === 1 && textMinute < 30) {
		redAge = `${textHour} hour ago`;
	} else if (textHour > 1) {
		redAge = `${textHour} hours ago`;
	} else if (textMinute === 1) {
		redAge = `${textMinute} minute ago`;
	} else if (textMinute > 1) {
		redAge = `${textMinute} minutes ago`;
	} else {
		redAge = `Few seconds ago`;
	}
	return redAge;
});

const Redpanel = mongoose.model("Redpanel", redpanelSchema)

module.exports = Redpanel

