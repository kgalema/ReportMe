const express = require("express");
const router = express.Router();
const TMM = require("../models/tmms")
const ClosedBreakdown = require("../models/closedBreakdown")
const { isLoggedIn, isAdmin, isConnectionOpen } = require("../middleware");

//================
// TMMS routes
//================

// 1. Index route -list all TMMS
router.get("/tmms", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	TMM.find({}, function (err, allTMMs) {
		if (err || !allTMMs) {
			req.flash("error", "Error occured while fetching all TMMs");
			return res.redirect("/breakdowns");
		}

		const collator = new Intl.Collator(undefined, {
			numeric: true,
			sensitivity: "base",
		});

		const sorted = allTMMs.sort(function (a, b) {
			return collator.compare(a.name, b.name);
		});

		const bolters = sorted.filter((b) => b.category === "roofBolter");
		const drillRigs = sorted.filter((dR) => dR.category === "drillRig");
		const LHDs = sorted.filter((LHD) => LHD.category === "LHD");
		const UVs = sorted.filter((UV) => UV.category === "UV");
		const LDVs = sorted.filter((LDV) => LDV.category === "LDV");
		const ug_belts = sorted.filter((belts) => belts.category === "ug_belts");
		const electrical = sorted.filter((elect) => elect.category === "electrical");
		const mechanical = sorted.filter((mech) => mech.category === "mechanical");
		const tmm_length = bolters.length + drillRigs.length + LHDs.length + LDVs.length + UVs.length;
		res.render("tmms/index", {
			bolters,
			drillRigs,
			LHDs,
			LDVs,
			UVs,
			ug_belts,
			electrical,
			mechanical,
			tmm_length,
			tmms: allTMMs,
			title: "assets",
		});
	});
});

// 2. New route - renders a for creating new TMM
router.get("/tmms/new", isLoggedIn, isAdmin, function (req, res) {
	res.render("tmms/new", { title: "assets" });
});

// 3. Create route - post a new TMM into the database then redirect elsewhere
router.post("/tmms", isLoggedIn, isAdmin, function (req, res) {
    TMM.create(req.body.TMM, function (err, newTMM) {
        if (err || !newTMM) {
            console.log(err)
            req.flash("error", "Something went wrong while creating new TMM");
            return res.redirect("/tmms/new");
        }
        newTMM.author.id = req.user._id;
        newTMM.save(function (err, savedTMM) {
        if (err || !savedTMM) {
            req.flash("error", "Something went wrong while associating user with TMM");
            return res.redirect("/tmms/new");
        }
        req.flash("success", "Successfully added new TMM");
        res.redirect("/tmms");
        });
    });
});


// 4. Show route - shows/get info about one specific TMM
router.get("/tmm/:id", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	TMM.findById(req.params.id, function (err, foundTMM) {
		if (err || !foundTMM) {
			req.flash("error", "TMM not found");
			return res.redirect("/tmms");
		}
		ClosedBreakdown.find({ "breakdown.equipment": foundTMM.name }, function (err, foundBreakdowns) {
			if (err || !foundTMM) {
				req.flash("error", "Error occure while fetching breakdowns for the asset");
				return res.redirect("/tmms");
			}
			const MORNING = foundBreakdowns.filter((e) => e.breakdown.shift === "morning");
			const AFTERNOON = foundBreakdowns.filter((e) => e.breakdown.shift === "afternoon");
			const NIGHT = foundBreakdowns.filter((e) => e.breakdown.shift === "night");
			res.render("tmms/show", { tmm: foundTMM, MORNING, AFTERNOON, NIGHT, foundBreakdowns, title: "assets" });
		});
	});
});

// 5. Edit route - renders edit form to edit one particular TMM
router.get("/tmm/:id/edit", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	TMM.findById(req.params.id, function (err, tmm) {
		if (err || !tmm) {
			req.flash("error", "TMM not found");
			return res.redirect("/tmms");
		}
		res.render("tmms/edit", { tmm: tmm, title: "assets" });
	});
});

// 6. Update route - Puts edited info about one particular TMM in the database
router.put("/tmm/:id", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	TMM.findByIdAndUpdate(req.params.id, req.body.TMM, function (err, updatedTMM) {
		if (err || !updatedTMM) {
			req.flash("error", "Could not update selected TMM");
			return res.redirect("/tmms");
		}
		req.flash("success", "Successfully updated TMM");
		res.redirect("/tmm/" + updatedTMM._id);
	});
});

// 7. Destroy route - Deletes a particular TMM
router.delete("/tmm/:id", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	TMM.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			req.flash("error", "Could not delete selected TMM");
			return res.redirect("/tmms");
		}
		req.flash("success", "Successfully deleted TMM");
		res.redirect("/tmms");
	});
});

module.exports = router;
