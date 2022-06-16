const express = require("express");
const router = express.Router();
const Allocation = require("../models/resourceAllocation");
const Section = require("../models/section");
const TMM = require("../models/tmms");
const Shift = require("../models/shift");
const { isLoggedIn, isAdmin, isConnectionOpen, checks } = require("../middleware");


// 1. Index route
router.get("/resource", isConnectionOpen, function (req, res) {
	Allocation.find({}, { _id: 1, LHD: 1, bolter: 1, drillRig: 1, section: 1, date: 1, shift: 1 }, function (err, allocation) {
		if (err || !allocation) {
			req.flash("error", "Error occured while retriving all allocations");
			return res.redirect("/production");
		}
		const collator = new Intl.Collator(undefined, {
			numeric: true,
			sensitivity: "base",
		});

		const allocations = allocation.sort(function (a, b) {
			return collator.compare(a.section, b.section);
		});
		res.render("resourceAllocation/index", { allocations, title: "resource-allocation" });
	});
});


// 2. New Route - renders a form for new resource allocation
router.get("/resource/new", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	Section.find({}, function (err, sections) {
		if (err || !sections) {
			req.flash("error", "Error occured while fetching sections");
			return res.redirect("/resource");
		}
        TMM.find({ $or: [{ category: "bolters" }, { category: "LHDs" }, { category: "drillRigs" }] }, function (err, tmms) {
			if (err || !tmms) {
				req.flash("error", "Error occured while fetching TMMs");
				return res.redirect("/resource");
			}
			Shift.find({}, function(err, shifts){
				if(err || !shifts){
					req.flash("error", "Error occured while retrieving shifts");
					return res.redirect("/resource");
				}

				const collator = new Intl.Collator(undefined, {
					numeric: true,
					sensitivity: "base",
				});

				const TMMS = tmms.sort(function (a, b) {
					return collator.compare(a.name, b.name);
				});

				const bolters = TMMS.filter(e => e.category === "bolters");
				const LHDs = TMMS.filter((e) => e.category === "LHDs");
				const drillRigs = TMMS.filter((e) => e.category === "drillRigs");
				res.render("resourceAllocation/new", { shifts, bolters, LHDs, drillRigs, sections, title: "resource-allocation" });
			});
		});
	});
});

// 3. Create route - post a new resource allocation into the database then redirect elsewhere
router.post("/resource", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	const dateToUse = new Date(req.body.date).toLocaleDateString();
	const dateToUse2 = new Date(req.body.date).toISOString();
	
	const uniqueCode = req.body.section + dateToUse + req.body.shift;
	req.body.uniqueCode = uniqueCode;

	req.body.author = { _id: req.user._id }

	Allocation.find({$and: [{shift: req.body.shift}, {date: dateToUse2}] }, {LHD: 1, drillRig: 1, bolter: 1, _id: 0}, function(err, allocations){
		if(err || !allocations){
			req.flash("error", "Error occured while validating allocations")
			return res.redirect("/resource")
		}

		const tmmsPayload = [...req.body.LHD, ...req.body.drillRig, ...req.body.bolter];
		const tmmsAllocated = [];
		const tmmsRejected = [];
		
		allocations.forEach(e => {
			e.LHD.forEach(lhd => {
				tmmsAllocated.push(lhd)
			})

			e.drillRig.forEach(rig => {
				tmmsAllocated.push(rig)
			})

			e.bolter.forEach(bolter => {
				tmmsAllocated.push(bolter)
			})
		})

		tmmsPayload.forEach(e => {
			if(tmmsAllocated.indexOf(e) > -1){
				console.log(e)
				tmmsRejected.push(e)
			}
		});

		if(tmmsRejected.length > 0){
			req.flash("error", `${tmmsRejected} have already been allocated sections for ${req.body.shift} shift`);
			return res.redirect("back")
		}

		Allocation.create(req.body, function (err, newAllocation) {
			if (err || !newAllocation) {
				req.flash("error", "Error occured while creating new resource allocation");
				return res.redirect("back");
			}
			req.flash("success", `Successfully allocated ${req.body.section} production TMMs`);
			res.redirect("/resource");
		});
	});
});

// 4. Show route: Shows info about 1 specific resource allocation
router.get("/resource/:resource_id", isConnectionOpen, function (req, res) {
	Allocation.findById(req.params.resource_id, function (err, foundAllocation) {
		if (err || !foundAllocation) {
			req.flash("error", "Error occured while retrieving selected allocation");
			return res.redirect("back");
		}
		res.render("resourceAllocation/show", { foundAllocation, title: "resource-allocation" });
	});
});

// 5. Edit - renders an edit form
router.get("/resource/:resource_id/edit", isConnectionOpen, isLoggedIn, checks, isAdmin, function (req, res) {
	Allocation.findById(req.params.resource_id, function (err, resource) {
		if (err || !resource) {
			req.flash("error", "Error occured while retrieving resource to edit");
			return res.redirect("/back");
		}
		TMM.find({ category: { $in: ["LHDs", "drillRigs", "bolters"] } }, function (err, foundTMMs) {
			if (err || !foundTMMs) {
				req.flash("error", "Error occured while fetching TMMs");
				return res.redirect("/resource");
			}

			const availableTMMs = []
			foundTMMs.forEach(e =>{
				if(req.tmmsAllocated.indexOf(e.name) === -1){
					availableTMMs.push(e)
				}
			})

			const collator = new Intl.Collator(undefined, {
				numeric: true,
				sensitivity: "base",
			});

			const sorted = availableTMMs.sort(function (a, b) {
				return collator.compare(a.name, b.name);
			});

			const drillRigs = sorted.filter((dR) => dR.category === "drillRigs");
			const LHDs = sorted.filter((LHD) => LHD.category === "LHDs");
			const bolters = sorted.filter((LHD) => LHD.category === "bolters");
			res.render("resourceAllocation/edit", { resource,  drillRigs, LHDs, bolters, title: "resource-allocation" });
		});
	});
});


// 6. Update - takes info from edit form and PUTs it into existing data in the database
router.put("/resource/:resource_id", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	Allocation.findByIdAndUpdate(req.params.resource_id, req.body, function (err, updatedResource) {
		if (err || !updatedResource) {
			req.flash("error", "Something went wrong while updating allocated resources");
			return res.redirect("back");
		}
		req.flash("success", "Successfully updated allocated resource");
		res.redirect("/resource/" + req.params.resource_id);
	});
});

// 7. Destroy - delete one specific allocation
router.delete("/resource/:resource_id", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	Allocation.findByIdAndRemove(req.params.resource_id, function (err) {
		if (err) {
			req.flash("error", "Error occured while deleting resource allocation");
			return res.redirect("back");
		}
		req.flash("success", "Successfully deleted resource allocation");
		res.redirect("/resource");
	});
});

module.exports = router;
