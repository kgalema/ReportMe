const express = require("express");
const router = express.Router();
const Section = require("../models/section");
const User = require("../models/user");
const Breakdown = require("../models/breakdown");
const TMM = require("../models/tmms");
const Shift = require("../models/shift");
const closedBreakdown = require("../models/closedBreakdown");
const Allocation = require("../models/resourceAllocation");
const { isLoggedIn, isBreakdownAuthor, isConnectionOpen, checkShift } = require("../middleware");


// 1. Index route -list all breakdowns
router.get("/breakdowns", isConnectionOpen, checkShift, function (req, res) {
	Breakdown.find({}, function (err, allBreakdowns) {
		if (err || !allBreakdowns) {
			req.flash("error", "Error occured while fetching breakdowns");
			return res.redirect("/");
		}
		closedBreakdown.find({}, function (err, closedBreakdowns) {
			if (err || !closedBreakdowns) {
				req.flash("error", "Error occured while fetching closed breakdowns");
				return res.redirect("/");
			}
			Shift.find({}, { name: 1, start: 1, end: 1, _id: 0, overlap: 1 }, function (err, foundShifts) {
				if (err || !foundShifts) {
					req.flash("error", "Error occured while fetching shift information");
					return res.redirect("/");
				}
				res.render("breakdowns/index", { shiftNow: req.shift, allBreakdowns, closedBreakdowns, foundShifts, title: "breakdowns" });
			});
		});
	})
})

// 2. New route - renders a for creating new breakdown
router.get("/breakdowns/new", isConnectionOpen, isLoggedIn, checkShift, function (req, res) {
	TMM.find({}, function (err, allTMMs) {
		if (err || !allTMMs) {
			req.flash("error", "Error occured while fetching TMMs");
			return res.redirect("/breakdowns");
		}
		Section.find({}, function (err, allSections) {
			if (err || !allSections) {
				req.flash("error", "Error occured while fetching sections");
				return res.redirect("/breakdowns");
			}
			const collator = new Intl.Collator(undefined, {
				numeric: true,
				sensitivity: "base",
			});

			const sorted = allTMMs.sort(function (a, b) {
				return collator.compare(a.name, b.name);
			});
			Shift.find({}, function (err, shifts) {
				if (err || !shifts) {
					req.flash("error", "Error occured while retrieving shifts");
					return res.redirect("/breakdowns");
				}
				Allocation.find({}, function(err, allocations){
					if(err || !allocations){
						req.flash("error", "Error occured while fetching resource allocations for today")
						return res.redirect("/breakdowns")
					}
					res.render("breakdowns/new", { allocations, title: "breakdowns", shiftNow: req.shift, shifts, tmms: sorted, sections: allSections });
				})
			});
		});
	});
});

// 3. Create route - post a new breakdown into the database then redirect elsewhere
router.post("/breakdown", isConnectionOpen, isLoggedIn, function (req, res) {
	const time = req.body.breakdown.startTime.split(":");
	const hours = Number(time[0]);
	const minutes = Number(time[1]);
	const startTime = new Date(req.body.breakdown.startDate);
	startTime.setHours(hours);
	startTime.setMinutes(minutes);
	startTime.setSeconds(0);
	startTime.setMilliseconds(0);
	req.body.breakdown.startTime = startTime;
	
	Section.findById(req.body.breakdown.sectionId, function (err, foundSection) {
		if (err || !foundSection) {
			req.flash("error", "Something went wrong while creating new breakdown");
			return res.redirect("breakdowns/new");
		}
		req.body.breakdown.section = { id: foundSection._id, name: foundSection.name };
		req.body.breakdown.author = { id: req.user._id };

		Shift.find({ name: req.body.breakdown.shift.toUpperCase() }, { start: 1, end: 1, overlap: 1 }, function (err, foundShift) {
			if (err || !foundShift) {
				req.flash("error", "Error occured while validating breakdown shift");
				return res.redirect("breakdowns/new");
			}
			const bdownStart = new Date(req.body.breakdown.startDate);

			const startHR = Number(foundShift[0].start.split(":")[0]);
			const startMin = Number(foundShift[0].start.split(":")[1]);
			bdownStart.setHours(startHR);
			bdownStart.setMinutes(startMin);

			const endHR = Number(foundShift[0].end.split(":")[0]);
			const endMin = Number(foundShift[0].end.split(":")[1]);

			req.body.breakdown.shiftStartTime = bdownStart;

			if(foundShift[0].overlap && hours >= 0 && hours <= endHR){
				const date = new Date(req.body.breakdown.startDate);
				date.setDate(date.getDate() - 1);
				date.setHours(startHR);
				date.setMinutes(startMin);
				req.body.breakdown.shiftStartTime = date;
			}

			Breakdown.create(req.body.breakdown, function (err, newBreakdown) {
				if (err || !newBreakdown) {
					req.flash("error", "Something went wrong while creating new breakdown");
					return res.redirect("breakdowns/new");
				}
				req.flash("success", "Successfully added new breakdown");
				res.redirect("/breakdowns");
			});
		});
	});
});

// 4. Show route - shows/get info about one specific breakdown
router.get("/breakdown/:id", isConnectionOpen, function (req, res) {
	Breakdown.findById(req.params.id, function (err, foundBreakdown) {
		if (err || !foundBreakdown) {
			req.flash("error", "Invalid breakdown ID");
			return res.redirect("/breakdowns");
		}
		res.render("breakdowns/show", { breakdown: foundBreakdown, title: "breakdowns" });
	});
});


// 5. Edit route - renders edit form to edit one particular breakdown
router.get("/breakdowns/:id/edit", isConnectionOpen, isLoggedIn, isBreakdownAuthor, function (req, res) {
	Breakdown.findById(req.params.id, function (err, breakdown) {
		if (err || !breakdown) {
			req.flash("error", "Breakdown ID does not exist");
			return res.redirect("back");
		}
		Section.find({}, function (err, sections) {
			if (err || !sections) {
				req.flash("error", "No sections in the database");
				return res.redirect("/breakdowns");
			}
			if (req.query.query && req.query.query === "next") {
				Shift.find({}, function(err, shifts){
					if(err || !shifts){
						req.flash("error", "Error occured while validating production shift")
						return res.redirect("/breakdowns")
					}
					return res.render("breakdowns/next", { breakdown, shifts, title: "breakdowns"});
				})
				return
			}
			Shift.find({}, function (err, shifts) {
				if (err || !shifts) {
					req.flash("error", "Error occured while validating production shift");
					return res.redirect("/breakdowns");
				}
				res.render("breakdowns/edit", { shifts, breakdown: breakdown, sections: sections, title: "breakdowns" });
			});
			
		});
	});
});


// 6. Update route - Puts edited info about one particular breakdown in the database
router.put("/breakdown/:id", isConnectionOpen, isLoggedIn, isBreakdownAuthor, function (req, res) {
	if(req.query.query && req.query.query === "next"){
		const nextShift = req.body.breakdown.shift.split("&")[0];
		const nextStartTime = req.body.breakdown.shift.split("&")[1];
		const closeEndTime = req.body.breakdown.shift.split("&")[2];
		const bdownDate = new Date()
		bdownDate.setHours(closeEndTime.split(":")[0]);
		bdownDate.setMinutes(closeEndTime.split(":")[1]);
		bdownDate.setSeconds(0);
		bdownDate.setMilliseconds(0);

		Breakdown.findById(req.params.id, {_id: 0,created: 0, createdAt: 0, updatedAt: 0, __v: 0 }, function(err, foundBreakdown){
			if(err || !foundBreakdown){
				req.flash("error", "Error occured while validating production shift");
				return res.redirect("back")

			}
			const closed = { author: { id: req.user._id } };
			closed.breakdown = foundBreakdown;
			closed.breakdown.shift = foundBreakdown.shift;
			closed.endTime = bdownDate;
			closed.comments = `Moved from ${foundBreakdown.shift} to ${nextShift} shift`;
			
			const start = new Date()
			start.setHours(nextStartTime.split(":")[0]);
			start.setMinutes(nextStartTime.split(":")[1]);
			start.setSeconds(0);
			start.setMilliseconds(0);

			const newOpen = { author: { 
					id: req.user._id 
				},
				...foundBreakdown._doc
			};

			newOpen.shift = nextShift;
			newOpen.startTime = start;

			closedBreakdown.create(closed, function(err, newClosedBreakdown){
				if(err || !newClosedBreakdown){
					req.flash("error", "Something went wrong while closing breakdown");
					return res.redirect("/breakdowns");
				}
				Breakdown.create(newOpen, function(err, newBreakdown){
					if(err || !newBreakdown){
						req.flash("error", `Error occured while creating new breakdown for ${nextShift} shift`)
						return res.redirect("/breakdowns")
					}
					Breakdown.findByIdAndDelete(req.params.id, function(err){
						if(err){
							req.flash("error", "Error occured while closing breakdown");
							return res.redirect("/breakdowns");
						}
						req.flash("success", "Successfully move a breakdown to next shift shift");
						return res.redirect("/breakdowns");
					});
				});
			});
		});
		return;
	}

	const time = req.body.breakdown.startTime.split(":");
	const hours = Number(time[0]);
	const minutes = Number(time[1]);
	const startTime = new Date(req.body.breakdown.startDate);
	startTime.setHours(hours);
	startTime.setMinutes(minutes);
	startTime.setSeconds(0);
	startTime.setMilliseconds(0);
	req.body.breakdown.startTime = startTime;

	Breakdown.findByIdAndUpdate(req.params.id, req.body.breakdown, function (err, updatedBreakdown) {
		if (err || !updatedBreakdown) {
			req.flash("error", "Error occured while updating a breakdown");
			return res.redirect("back");
		}
		req.flash("success", "Successfully updated breakdown");
		res.redirect("/breakdown/" + req.params.id);
	});
});

router.delete("/breakdowns/:id", isConnectionOpen, isLoggedIn, isBreakdownAuthor, function (req, res) {
	Breakdown.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			req.flash("error", "Breakdown not deleted. Something went wrong");
			return res.redirect("back");
		}
		req.flash("success", "Successfully deleted breakdown");
		res.redirect("/breakdowns");
	});
});



module.exports = router;