const express = require("express");
const router = express.Router();
const User = require("../models/user");
const ClosedBreakdown = require("../models/closedBreakdown");
const Breakdown = require("../models/breakdown");
const { isLoggedIn, isClosedBreakdownAuthor, isConnectionOpen } = require("../middleware");

// 1. Index route -list all breakdowns
router.get("/closedBreakdowns", function (req, res) {
	res.redirect("/breakdowns");
});

// 2. New route - renders a for creating new closed breakdown
router.get("/sections/:sectionId/closedBreakdowns/new", isConnectionOpen, isLoggedIn, function (req, res) {
	Breakdown.findById(req.query.q, function (err, foundBreakdown) {
		if (err && !foundBreakdown) {
			req.flash("error", "The breakdown you are trying to close does not exist");
			return res.redirect("/breakdowns");
		}
		res.render("breakdowns/closed/new", {
			title: "breakdowns",
			foundBreakdown,
		});
	});
});

// 3. Create route - post a new breakdown into the database then redirect elsewhere
router.post("/breakdowns/:breakdownId/closedBreakdowns", isConnectionOpen, isLoggedIn, function (req, res) {
	const time = req.body.closedBreakdown.endTime.split(":");
	const hours = Number(time[0]);
	const minutes = Number(time[1]);
	// const endTime = new Date();
	const endTime = new Date(req.body.closedBreakdown.endDate);
	endTime.setHours(hours);
	endTime.setMinutes(minutes);
	endTime.setSeconds(0);
	endTime.setMilliseconds(0);
	req.body.closedBreakdown.endTime = endTime;

	Breakdown.findById(req.params.breakdownId, function (err, foundBreakdown) {
		if (err || !foundBreakdown) {
			req.flash("error", "Breakdown you are trying to close doesn't exist");
			return res.redirect("breakdowns");
		}
		ClosedBreakdown.create(req.body.closedBreakdown, function (err, newClosedBreakdown) {
			if (err || !newClosedBreakdown) {
				req.flash("error", "Something went wrong while closing breakdown");
				return res.redirect("breakdowns");
			}
			newClosedBreakdown.author.id = req.user._id;
			newClosedBreakdown.breakdown = foundBreakdown;

			newClosedBreakdown.save(function (err, savedClosedBreakdown) {
				if (err || !savedClosedBreakdown) {
					req.flash("error", "Something went wrong while creating saving breakdown report");
					return res.redirect("back");
				}
				Breakdown.findByIdAndDelete(req.params.breakdownId, function (err) {
					if (err) {
						req.flash("error", "Error occured while deleting breakdown");
						res.redirect("/breakdowns");
					}

					req.flash("success", "Successfully closed breakdown");
					res.redirect("/breakdowns");
				});
			});
		});
	});
});

// 4. Show route - shows/get info about one specific breakdown
router.get("/closedBreakdowns/:id", function (req, res) {
	ClosedBreakdown.findById(req.params.id, function (err, foundClosedBreakdown) {
		if (err || !foundClosedBreakdown) {
			req.flash("error", "Invalid breakdown ID");
			return res.redirect("/breakdowns");
		}  
		res.render("breakdowns/closed/show", { closedBreakdown: foundClosedBreakdown, title: "breakdowns" });
	});
});

// 5. Edit route - renders edit form to edit one particular breakdown
router.get("/closedBreakdowns/:id/edit", isConnectionOpen, isLoggedIn, isClosedBreakdownAuthor, function (req, res) {
	ClosedBreakdown.findById(req.params.id, function (err, breakdown) {
		if (err || !breakdown) {
			req.flash("error", "Error occured while fetching breakdown");
			return res.redirect("back");
		}
		res.render("breakdowns/closed/edit", { breakdown: breakdown, title: "breakdowns" });
	});
});

// 6. Update route - Puts edited info about one particular breakdown in the database
router.put("/closedBreakdowns/:id", isConnectionOpen, isLoggedIn, isClosedBreakdownAuthor, function (req, res) {
	const time = req.body.closedBreakdown.endTime.split(":");
	const hours = Number(time[0]);
	const minutes = Number(time[1]);
	const endTime = new Date(req.body.closedBreakdown.endDate);
	endTime.setHours(hours);
	endTime.setMinutes(minutes);
	endTime.setSeconds(0);
	endTime.setMilliseconds(0);
	req.body.closedBreakdown.endTime = endTime;

	ClosedBreakdown.findByIdAndUpdate(req.params.id, req.body.closedBreakdown, function (err, updatedBreakdown) {
		if (err || !updatedBreakdown) {
			req.flash("error", "Error occured while updating a breakdown");
			return res.redirect("/closedBreakdowns/" + req.params.id + "/edit");
		}

		updatedBreakdown.save(function (err, savedBr) {
			if (err || !savedBr) {
				req.flash("error", "Could not save updated breakdown");
				return res.redirect("/breakdowns");
			}
			req.flash("success", "Successfully updated closed breakdown");
			res.redirect("/closedBreakdowns/" + savedBr._id);
		});
	});
});

router.delete("/closedBreakdowns/:id", isConnectionOpen, isLoggedIn, isClosedBreakdownAuthor,  function (req, res) {
	ClosedBreakdown.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			req.flash("error", "Breakdown not deleted. Something went wrong");
			return res.redirect("back");
		}
		req.flash("success", "Successfully deleted breakdown");
		res.redirect("/breakdowns");
	});
});

module.exports = router;
