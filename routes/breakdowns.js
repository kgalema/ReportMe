const express = require("express");
const router = express.Router();
const Section = require("../models/section");
const User = require("../models/user");
const Breakdown = require("../models/breakdown");
const TMM = require("../models/tmms");
const Shift = require("../models/shift");
const closedBreakdown = require("../models/closedBreakdown")
const { isLoggedIn, isBreakdownAuthor } = require("../middleware");


// 1. Index route -list all breakdowns
router.get("/breakdowns", function (req, res) {
	Breakdown.find({}, function (err, allBreakdowns) {
		if (err || !allBreakdowns) {
			req.flash("error", "Error occured while fetching breakdowns")
			return res.redirect("/")
		}
		closedBreakdown.find({}, function(err, closedBreakdowns){
			if(err || !closedBreakdowns){
				req.flash("error", "Error occured while fetching closed breakdowns");
        		return res.redirect("/");
			}
			Shift.find({}, {name: 1, start: 1, end: 1, _id: 0, overlap: 1}, function(err, foundShifts){
				if(err || !foundShifts){
					req.flash("error", "Error occured while fetching shift information");
					return res.redirect("/");
				}
				console.log(foundShifts)
				res.render("breakdowns/index", { allBreakdowns, closedBreakdowns, foundShifts, title: "breakdowns" });
			})
		})
	})
})

// 2. New route - renders a for creating new breakdown
router.get("/breakdowns/new", isLoggedIn, function (req, res) {
	TMM.find({}, function (err, allTMMs) {
		if (err || !allTMMs) {
		req.flash("error", "Error occured while fetching TMMs");
		return res.redirect("/breakdowns");
		}
		Section.find({}, function(err, allSections){
			if(err || !allSections){
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
			res.render("breakdowns/new", { title: "breakdowns", tmms: sorted, sections: allSections });
		});
	});
});

// 3. Create route - post a new breakdown into the database then redirect elsewhere
router.post("/breakdown", isLoggedIn, function (req, res) {
	const time = req.body.breakdown.startTime.split(":");
	const hours = Number(time[0]);
	const minutes = Number(time[1]);
	const startTime = new Date(req.body.breakdown.startDate);
	startTime.setHours(hours);
	startTime.setMinutes(minutes);
	startTime.setSeconds(0);
	startTime.setMilliseconds(0);
	req.body.breakdown.startTime = startTime;

	Section.findById(req.body.breakdown.sectionId, function(err, foundSection){
		if(err){
			req.flash("error", "Something went wrong while creating new breakdown");
			return res.redirect("breakdowns/new")
		}
		req.body.breakdown.section = {id: foundSection._id,name:foundSection.name}
		Breakdown.create(req.body.breakdown, function (err, newBreakdown) {
			if (err || !newBreakdown) {
				req.flash("error", "Something went wrong while creating new breakdown");
				return res.redirect("breakdowns/new");
			}
			newBreakdown.author.id = req.user._id;
			newBreakdown.save(function (err, savedBreakdown) {
				if (err || !savedBreakdown) {
					req.flash("error", "Something went wrong while creating saving breakdown report");
					return res.redirect("back");
				}
				req.flash("success", "Successfully added new breakdown");
				res.redirect("/breakdowns");
			});
		});
	});
});

// 4. Show route - shows/get info about one specific breakdown
router.get("/breakdown/:id", function (req, res) {
	Breakdown.findById(req.params.id, function (err, foundBreakdown) {
		if (err || !foundBreakdown) {
			req.flash("error", "Invalid breakdown ID")
			return res.redirect("/breakdowns")
		}
		res.render("breakdowns/show", { breakdown: foundBreakdown, title: "breakdowns" })
	});
})


// 5. Edit route - renders edit form to edit one particular breakdown
router.get("/breakdowns/:id/edit", isLoggedIn, isBreakdownAuthor, function (req, res) {
	Breakdown.findById(req.params.id, function (err, breakdown) {
		if (err || !breakdown) {
			req.flash("error", "Breakdown ID does not exist")
			return res.redirect("back")
		}
		Section.find({}, function(err, sections){
			if(err || !sections){
				req.flash("error", "No sections in the database");
				return res.redirect("/breakdowns")
			}
			res.render("breakdowns/edit", { breakdown: breakdown, sections: sections, title: "breakdowns"})
		})
	})
})


// 6. Update route - Puts edited info about one particular breakdown in the database
router.put("/breakdown/:id", isLoggedIn, isBreakdownAuthor, function (req, res) {
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
			console.log(err)
			return res.redirect("back")
		} 
		req.flash("success", "Successfully updated breakdown")
		res.redirect("/breakdown/" + req.params.id)
	})
})

router.delete("/breakdowns/:id", isLoggedIn, isBreakdownAuthor, function (req, res) {
    Breakdown.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            req.flash("error", "Breakdown not deleted. Something went wrong")
            return res.redirect("back");
        }
        req.flash("success", "Successfully deleted breakdown");
        res.redirect("/breakdowns");
    });
  }
);



module.exports = router;