const express = require("express")
const router = express.Router()
const Section = require("../models/section")
const Production = require("../models/production")
const TMM = require("../models/tmms")
const User = require("../models/user")
const ProductionCalendar = require("../models/productionCalendar")
const { isLoggedIn, isProductionAuthor, isSectionSelected, isAdmin, isConnectionOpen } = require("../middleware")



//===========================
// Production Reports Routes
//===========================

// 1. Landing Route
router.get("/", function (req, res) {
	res.redirect("/production")
})


// 1. ***Index route: Shows you all captured reports***
router.get("/production", isConnectionOpen, function (req, res) {
	Production.find({}, function (err, allProduction) {
		if (err || !allProduction) {
			req.flash("error", "Oops! Error occured while fetching production reports");
			return res.redirect("back");
		}
		Section.find({},  function(err, sections){
			if (err || !sections) {
				req.flash("error", "Error occured while fetching sections");
				return res.redirect("back");
			}
			res.render("production/index", { production: allProduction, sections, title: "production-dash" });
		})
	});
});

router.get("/api/production", function (req, res) {
	Production.find({}, function (err, allProduction) {
		if (err) {
			console.log(err);
			req.flash("error", "Oops! Seems like the database is down. Please contact admin");
			return res.redirect("back");
		} else {
			res.send(allProduction);
		}
	})
})



// 2. ***New route: Renders production report form***
router.get("/sections/:id/production/new", isConnectionOpen, isLoggedIn, isSectionSelected, function (req, res) {
	Section.findById(req.params.id, function (err, foundSection) {
		if (err || !foundSection) {
			req.flash("error", "Oops! Invalid Section ID. Section Not Found");
			return res.redirect("/production");
		}
		TMM.find({ category: { $in: ["LHD", "drillRig", "roofBolter"] } }, function (err, foundTMMs) {
			if (err || !foundTMMs) {
				req.flash("error", "Error occured while fetching TMMs");
				return res.redirect("/production");
			}
			const collator = new Intl.Collator(undefined, {
				numeric: true,
				sensitivity: "base",
			});

			const sorted = foundTMMs.sort(function (a, b) {
				return collator.compare(a.name, b.name);
			});
			const drillRigs = sorted.filter((dR) => dR.category === "drillRig");
			const LHDs = sorted.filter((LHD) => LHD.category === "LHD");
			const bolters = sorted.filter((LHD) => LHD.category === "roofBolter");
			ProductionCalendar.find({}, {date: 1, _id: 0}, function(err, foundDates){
				if(err || !foundDates){
					req.flash("error", "Error while retrieving production days")
					return res.redirect("/production")
				}
				const foundDates1 = foundDates.map(e => e.date)
				console.log(foundDates)
				console.log(foundDates1)
				res.render("production/new", { foundDates1, section: foundSection, drillRigs, LHDs, bolters, title: "production-dash" });
			});
		});
	});
});


// 3. Create route - post the information into the database
router.post("/sections/:id/production", isConnectionOpen, isLoggedIn, function (req, res) {
	Section.findById(req.params.id, function (err, section) {
		if (err || !section) {
			req.flash("error", "Oops! Seems like the database is down or section has been deleted");
			return res.redirect("back");
		}
		let dateNow = new Date().toLocaleDateString();

		if (req.body.production.created) {
			dateNow = new Date(req.body.production.created).toLocaleDateString();
		}
		const uniqueCode = section.name + dateNow + req.body.production.general[0].shift;
		req.body.production.uniqueCode = uniqueCode;
		Production.create(req.body.production, function (err, foundProduction) {
			if (err || !foundProduction) {
				req.flash("error", "Looks like you are trying to create duplicate report");
				return res.redirect("/production");
			}
			foundProduction.section.id = section._id;
			foundProduction.section.name = section.name;
			foundProduction.section.budget = section.budget;
			foundProduction.section.forecast = section.forecast;
			foundProduction.section.plannedAdvance = section.plannedAdvance;
			foundProduction.author = req.user._id;
			foundProduction.save(function (err, savedProduction) {
				if (err || !savedProduction) {
					req.flash("error", "Error while saving report");
					return res.redirect("back");
				}
				req.flash("success", "Successfully Added Production Report");
				res.redirect("/production");
			});
		});
	});
});




// 4. Show route: Shows info about 1 specific production report
router.get("/sections/:id/production/:production_id", isConnectionOpen, function (req, res) {
	Production.findById(req.params.production_id, function (err, foundProduction) {
		if (err || !foundProduction) {
			req.flash("error", "Oops! Seems like what you are looking for has vanished from the database");
			return res.redirect("back");
		}
		User.findById(foundProduction.author, { preferredName: 1 }, function (err, user) {
			if (err || !user) {
				req.flash("error", "Looks like the report does not have author");
				return res.redirect("back");
			}
			res.render("production/showProduction", { reported: foundProduction, reportedUser: user, title: "production-dash" });
		});
	});
});

// 5. Edit - shows an edit production edit form
router.get("/sections/:id/production/:production_id/edit", isConnectionOpen, isLoggedIn, isProductionAuthor, function (req, res) {
	Production.findById(req.params.production_id, function (err, foundProduction) {
		if (err || !foundProduction) {
			req.flash("error", "Something went wrong with the database");
			return res.redirect("/back");
		} 
		TMM.find({ category: { $in: ["LHD", "drillRig", "roofBolter"] } }, function (err, foundTMMs) {
			if (err || !foundTMMs) {
				req.flash("error", "Error occured while fetching TMMs");
				return res.redirect("/production");
			}
			const collator = new Intl.Collator(undefined, {
				numeric: true,
				sensitivity: "base",
			});

			const sorted = foundTMMs.sort(function (a, b) {
				return collator.compare(a.name, b.name);
			});
			const drillRigs = sorted.filter((dR) => dR.category === "drillRig");
			const LHDs = sorted.filter((LHD) => LHD.category === "LHD");
			const bolters = sorted.filter((LHD) => LHD.category === "roofBolter");

			res.render("production/edit", { production: foundProduction, drillRigs, LHDs, bolters,title: "production-dash" });
		})
	});
});
// 6. Update - takes info from edit form and PUTs it into existing data in the database
router.put("/sections/:id/production/:production_id", isConnectionOpen, isLoggedIn, isProductionAuthor, function (req, res) {
	Production.findByIdAndUpdate(req.params.production_id, req.body.production, function (err, updatedProduction) {
		if (err || !updatedProduction) {
			req.flash("error", "Something went wrong with the database");
			return res.redirect("back");
		}
		req.flash("success", "Successfully Updated Production Report");
		res.redirect("/sections/" + req.params.id + "/production/" + req.params.production_id);
	});
});

// 7. Destroy - delete one specific production report
router.delete("/sections/:id/production/:production_id", isConnectionOpen, isLoggedIn, isProductionAuthor, function (req, res) {
	Production.findByIdAndRemove(req.params.production_id, function (err) {
		if (err) {
			req.flash("error", "Something went wrong with the database");
			return res.redirect("back");
		} else {
			req.flash("success", "Successfully Deleted Production Report");
			res.redirect("/production");
		}
	});
});


module.exports = router;
