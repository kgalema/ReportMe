const Section = require("./models/section");
const Redpanel = require("./models/tarp");
const Production = require("./models/production");
const NewRedPanel = require("./models/newRed");
const Rehab = require("./models/rehab");
const User = require("./models/user");
const Breakdown = require("./models/breakdown");
const ClosedBreakdown = require("./models/closedBreakdown");
const Allocation = require("./models/resourceAllocation");
const Shift = require("./models/shift");

const mongoose = require("mongoose");

// mongoose.connection.on("connected", () => {
// 	console.log("On connected emmited inside middlware*******************************************");
// });

let isDBconnected = false;
mongoose.connection.on("open", () => {
	console.log("DB live");
	isDBconnected = true;
	console.log(isDBconnected);
});

mongoose.connection.on("disconnected", () => {
	console.log("DB dead");
	isDBconnected = false;
	console.log(isDBconnected);
});

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash("error", "You need to be logged in first");
		return res.redirect("/login");
	}
	next();
};

module.exports.isAuthor = (req, res, next) => {
	Redpanel.findById(req.params.redpanel_id, function (err, foundRed) {
		if (err || foundRed === null) {
			req.flash("error", "Something went wrong");
			return res.redirect(`/redPanel/${req.params.redpanel_id}`);
		}
		if (!foundRed.author.equals(req.user._id) && !req.user.isAdmin) {
			req.flash("error", "You do not have permission to do that");
			return res.redirect(`/redPanel/${req.params.redpanel_id}`);
		}
		next();
	});
};
module.exports.isRehabAuthor = (req, res, next) => {
	Rehab.findById(req.params.rehabedPanel_id, function (err, foundRed) {
		if (err || foundRed === null) {
			req.flash("error", "Something went wrong");
			return res.redirect(`/redPanel`);
		}
		if (!foundRed.author.equals(req.user._id) && !req.user.isAdmin) {
			req.flash("error", "You do not have permission to do that");
			return res.redirect(`/redPanel`);
		}
		next();
	});
};

module.exports.isSectionAuthor = (req, res, next) => {
	Section.findById(req.params.id, function (err, foundSection) {
		if (err || !foundSection) {
			req.flash("error", "Something went wrong");
			return res.redirect(`/sections/${req.params.redpanel_id}`);
		}

		if (!foundSection.author.equals(req.user._id) && !req.user.isAdmin) {
			req.flash("error", "You do not have permission to do that");
			return res.redirect(`/sections/${req.params.id}`);
		}
		next();
	});
};

module.exports.isBreakdownAuthor = (req, res, next) => {
	Breakdown.findById(req.params.id, function (err, foundBreakdown) {
		if (err) {
			req.flash("error", "Something went wrong");
			return res.redirect(`/breakdown/${req.params.id}`);
		}

		if (!foundBreakdown.author.equals(req.user._id) && !req.user.isAdmin) {
			req.flash("error", "You do not have permission to do that");
			return res.redirect(`/breakdown/${req.params.id}`);
		}
		next();
	});
};
module.exports.isClosedBreakdownAuthor = (req, res, next) => {
	ClosedBreakdown.findById(req.params.id, function (err, foundBreakdown) {
		if (err) {
			req.flash("error", "Something went wrong while validating breakdown author");
			return res.redirect(`/closedBreakdowns/${req.params.id}`);
		}

		if (!foundBreakdown.author.equals(req.user._id) && !req.user.isAdmin) {
			req.flash("error", "You do not have permission to do that");
			return res.redirect(`/closedBreakdowns/${req.params.id}`);
		}
		next();
	});
};

module.exports.isProductionAuthor = (req, res, next) => {
	Production.findById(req.params.production_id, function (err, foundProduction) {
		if (err) {
			req.flash("error", "Something went wrong");
			return res.redirect(`/sections/${foundProduction.section.id}/production/${req.params.production_id}`);
		}
		if (!foundProduction.author.equals(req.user._id) && !req.user.isAdmin) {
			req.flash("error", "You do not have permission to do that");
			return res.redirect(`/sections/${foundProduction.section.id}/production/${req.params.production_id}`);
		}
		next();
	});
};

module.exports.isNewRedAuthor = (req, res, next) => {
	NewRedPanel.findById(req.params.newRedPanel_id, function (err, foundNewRed) {
		if (err || !foundNewRed) {
			req.flash("error", "Something went wrong while checking author");
			return res.redirect("back");
		}

		if (!foundNewRed.author.equals(req.user._id) && !req.user.isAdmin) {
			req.flash("error", "You do not have permission to do that");
			return res.redirect("back");
		}
		next();
	});
};
module.exports.isAdmin = (req, res, next) => {
	User.findById(req.user._id, function (err, foundUser) {
		if (err || !foundUser) {
			req.flash("error", "Something went wrong while checking user");
			return res.redirect("/production");
		}

		if (!req.user.isAdmin) {
			req.flash("error", "You do not have permission to do that. Contact Admin");
			return res.redirect("/production");
		}
		console.log("Hi");
		next();
	});
};
module.exports.isSectionSelected = (req, res, next) => {
	Section.findById(req.params.id, function (err, foundSection) {
		if (err || !foundSection) {
			// req.session.returnTo = req.originalUrl
			req.session.goTo = req.originalUrl;
			req.flash("warning", "Please select a section to proceed");
			return res.redirect("/sections");
		}
		next();
	});
};

module.exports.isConnectionOpen = (req, res, next) => {
	console.log(`DB open: ${isDBconnected}`);
	if (!isDBconnected) {
		return res.render("welcomePage");
	}
	req.DBconnection = mongoose.connection.db;
	next();
};

module.exports.isResourceAlreadyAllocated = (req, res, next) => {
	const dateToUse2 = req.body.dateToUse2;
	Allocation.find({ $and: [{ shift: req.body.shift }, { date: dateToUse2 }] }, { LHD: 1, drillRig: 1, bolter: 1, _id: 0 }, function (err, allocations) {
		if (err || !allocations) {
			req.flash("error", "Error occured while validating allocations");
			return res.redirect("/resource");
		}

		const tmmsPayload = [...req.body.LHD, ...req.body.drillRig, ...req.body.bolter];
		const tmmsAllocated = [];
		const tmmsRejected = [];

		allocations.forEach(e => {
			e.LHD.forEach(lhd => {
				tmmsAllocated.push(lhd);
			});

			e.drillRig.forEach(rig => {
				tmmsAllocated.push(rig);
			});

			e.bolter.forEach(bolter => {
				tmmsAllocated.push(bolter);
			});
		});

		tmmsPayload.forEach(e => {
			if (tmmsAllocated.indexOf(e) > -1) {
				console.log(e);
				tmmsRejected.push(e);
			}
		});

		if (tmmsRejected.length > 0) {
			req.flash("error", `${tmmsRejected} have already been allocated sections for ${req.body.shift} shift`);
			return res.redirect("back");
		}

		next();
	});
};
module.exports.checks = (req, res, next) => {
	Allocation.findById(req.params.resource_id, function (err, foundAllocation) {
		if (err || !foundAllocation) {
			req.flash("error", "Error occured while looking up allocation");
			return res.redirect("/back");
		}
		const shift = foundAllocation.shift;
		const date = new Date(foundAllocation.date).toISOString();
		Allocation.find({ $and: [{ shift: shift }, { date: date }] }, { LHDs: 1, drillRigs: 1, bolters: 1, _id: 0 }, function (err, allocationsMatched) {
			if (err || !allocationsMatched) {
				req.flash("error", "Error occured while looking up matched resources");
				return res.redirect("/back");
			}
			const tmmsAllocated = [];
			allocationsMatched.forEach(e => {
				e.LHDs.forEach(lhd => {
					tmmsAllocated.push(lhd);
				});

				e.drillRigs.forEach(rig => {
					tmmsAllocated.push(rig);
				});

				e.bolters.forEach(bolter => {
					tmmsAllocated.push(bolter);
				});
			});
			req.tmmsAllocated = tmmsAllocated;
			next();
		});
	});
};

module.exports.checkShift = (req, res, next) => {
	Shift.find({}, function (err, shifts) {
		if (err || !shifts) {
			req.flash("error", "Error occured while validating current shift");
			return res.redirect("/back");
		}
		const now = new Date();
		const hr = now.getHours();
		const mins = now.getMinutes() / 60;
		const timeNow = hr + mins;
		req.shift = "NONE";
		shifts.forEach(shift => {
			const timeStart = Number(shift.start.split(":")[0]) + Number(shift.start.split(":")[1]) / 60;
			const timeEnd = Number(shift.end.split(":")[0]) + Number(shift.end.split(":")[1]) / 60;

			if (timeNow >= timeStart && timeNow <= timeEnd) {
				req.shift = shift.name;
			} else if (timeNow + 24 >= timeStart && timeNow + 24 <= timeEnd + 24 && shift.overlap) {
				req.shift = shift.name;
			}
		});
		next();
	});
};
