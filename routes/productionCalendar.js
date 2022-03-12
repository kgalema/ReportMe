const express = require("express");
const router = express.Router();
const ProductionCalendar = require("../models/productionCalendar");
const { isLoggedIn, isAdmin, isConnectionOpen } = require("../middleware");

// 1. Index route -list all production calendar
router.get("/productionCalendar", isConnectionOpen, function (req, res) {
	ProductionCalendar.find({}, function (err, foundDates) {
		if (err || !foundDates) {
			req.flash("error", "Error occured while retrieving production days");
			return res.redirect("/production");
		}
		console.log(foundDates);
		res.render("productionCalendar/index", { title: "production-calendar", foundDates });
	});
});

// 2. New route - renders a form for creating new month calendar.
router.get("/productionCalendar/new", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	res.render("productionCalendar/new", { title: "production-calendar" });
});

// 3. Create route - post a new blasting shift into the database then redirect elsewhere
router.post("/productionCalendar", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	ProductionCalendar.create(req.body.productionShift, function (err, createdDate) {
		if (err || !createdDate) {
			req.flash("error", "Error occured while creating new production shift");
			return res.redirect("/productionCalendar");
		}
		req.flash("success", "Successfully created production shift");
		res.redirect("/productionCalendar");
	});
});

// 4. Show route - shows/get info about one specific production shift
router.get("/productionCalendar/:id", isConnectionOpen, function (req, res) {
	ProductionCalendar.findById(req.params.id, function (err, foundDate) {
		if (err || !foundDate) {
			req.flash("error", "Error occured while fetching production shift");
			return res.redirect("/productionCalendar");
		}
		res.render("productionCalendar/show", { foundDate, title: "production-calendar" });
	});
});

// 5. Edit route - renders edit form to edit one particular production shift
router.get("/productionCalendar/:id/edit", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	ProductionCalendar.findById(req.params.id, function (err, foundDate) {
		if (err || !foundDate) {
			req.flash("error", "Error occured while fetching production shift to edit");
			return res.redirect("/productionCalendar");
		}
		res.render("productionCalendar/edit", { foundDate, title: "production-calendar" });
	});
});

// 6. Update route - Puts edited info about one particular production shift in the database
router.put("/productionCalendar/:id", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	ProductionCalendar.findByIdAndUpdate(req.params.id, req.body.productionShift, function (err, updatedProductionShift) {
		if (err || !updatedProductionShift) {
			req.flash("error", "Something went wrong while updating production shift");
			return res.redirect("/productionCalendar");
		}
		req.flash("success", "Successfully updated production shift");
		res.redirect("/productionCalendar/" + req.params.id);
	});
});

// Delete one particular production shift
router.delete("/productionCalendar/:id", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	ProductionCalendar.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			req.flash("error", "Breakdown not deleted. Something went wrong");
			return res.redirect("/productionCalendar");
		}
		req.flash("success", "Successfully deleted production shift");
		res.redirect("/productionCalendar");
	});
});

module.exports = router;
