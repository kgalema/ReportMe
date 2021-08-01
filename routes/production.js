const express = require("express")
const router = express.Router()
const Section = require("../models/section")
const ROM = require("../models/ROM")
const PlantFeed = require("../models/plantFeed")
const Production = require("../models/production")
const moment = require("moment")
const { isLoggedIn, isProductionAuthor, isSectionSelected, isAdmin } = require("../middleware")




//===========================
// Production Reports Routes
//===========================

// 1. Landing Route
router.get("/", function (req, res) {
	res.redirect("/production")
	// res.render("welcomePage", { title: "home" })
})


// 1. ***Index route: Shows you all captured reports***
router.get("/production", function (req, res) {
	Production.find({}, function (err, allProduction) {
		if (err) {
			req.flash("error", "Oops! Error occured while fetching Production data")
			return res.redirect("back")
		} else {
			ROM.find({}, function(err, roms){
				if(err){
					req.flash("error", "Oops! Error occured while fetching ROM data")
					return res.redirect("back")
				} else {
					PlantFeed.find({}, function(err, feeds){
						if(err){
							req.flash("error", "Oops! Error occured while fetching Plant Feed data")
							return res.redirect("back")
						} else {
							res.render("production/index", { production: allProduction, roms: roms, feeds: feeds, title: "production-dash" })
						}
					})
				}
			})
		}
	})
})
router.get("/api/production", function (req, res) {
	Production.find({}, function (err, allProduction) {
		if (err) {
			console.log(err);
			req.flash("error", "Oops! Seems like the database is down. Please contact admin")
			return res.redirect("back")
		} else {
			// console.log(allProduction)
			// res.render("production/index", { production: allProduction })
			res.send(allProduction)
		}
	})
})



// 2. ***New route: Renders production report form***
router.get("/sections/:id/production/new", isLoggedIn, isSectionSelected, function (req, res) {
	Section.findById(req.params.id, function (err, foundSection) {
		if (err || !foundSection) {
			req.flash("error", "Oops! Invalid Section ID. Section Not Found")
			return res.redirect("back")
		} else {
			res.render("production/new", { section: foundSection, title: "production-dash" });
		}
	})
})


// 3. Create route - post the information into the database
router.post("/sections/:id/production", isLoggedIn, function (req, res) {
	Section.findById(req.params.id, function (err, section) {
		if (err || !section) {
			req.flash("error", "Oops! Seems like the database is down or section has been deleted")
			console.log(err)
			return res.redirect("back");
		} else {
			let uniqueCode = section.name + new Date().toLocaleDateString() + req.body.production.general[0].shift
			req.body.production.uniqueCode = uniqueCode;
			// console.log(req.body.production)
			Production.create(req.body.production, function (err, foundProduction) {
				if (err) {
					// console.log(err)
					req.flash("error", "Looks like you are trying to create duplicate report")
					return res.redirect("back")
				} else {
					foundProduction.section.id = section._id;
					foundProduction.section.name = section.name;
					foundProduction.section.budget = section.budget;
					foundProduction.section.forecast = section.forecast;
					foundProduction.section.plannedAdvance = section.plannedAdvance;
					// foundProduction.uniqueCode = uniqueCode;
					foundProduction.author = req.user._id
					foundProduction.save(function (err, savedProduction) {
						if (err) {
							console.log(err)
							return res.redirect("back")
						} else {
							console.log(savedProduction)
							// section.production.push(foundProduction);
							section.save(function (err, savedSection) {
								if (err) {
									return res.redirect("back")
								} else {
									req.flash("success", "Successfully Added Production Report")
									res.redirect("/production");
								}
							});
						}
					});
				}
			})
		}
	})
})




// 4. Show route: Shows info about 1 specific production report
router.get("/sections/:id/production/:production_id", function (req, res) {
	Production.findById(req.params.production_id, function (err, foundProduction) {
		if (err || !foundProduction) {
			req.flash("error", "Oops! Seems like what you are looking for has vanished from the database")
			return res.redirect("back")
		} else {
			res.render("production/showProduction", { reported: foundProduction, title: "production-dash" });
		}
	});
})

// 5. Edit - shows an edit production edit form
router.get("/sections/:id/production/:production_id/edit", isLoggedIn, isProductionAuthor, function (req, res) {
	Production.findById(req.params.production_id, function (err, foundProduction) {
		if (err) {
			req.flash("error", "Something went wrong with the database")
			return res.redirect("/back")
		} else {
			res.render("production/edit", { production: foundProduction, title: "production-dash" })
		}
	})
})
// 6. Update - takes info from edit form and PUTs it into existing data in the database
router.put("/sections/:id/production/:production_id", isLoggedIn, isProductionAuthor, function (req, res) {
	console.log(req.body.production)
	Production.findByIdAndUpdate(req.params.production_id, req.body.production, function (err, updatedProduction) {
		if (err || !updatedProduction) {
			console.log(err)
			req.flash("error", "Something went wrong with the database")
			return res.redirect("back")
		} else {
			req.flash("success", "Successfully Updated Production Report")
			res.redirect("/sections/" + req.params.id + "/production/" + req.params.production_id)
		}
	})
})

// 7. Destroy - delete one specific production report
router.delete("/sections/:id/production/:production_id", isLoggedIn, isProductionAuthor, function (req, res) {
	Production.findByIdAndRemove(req.params.production_id, function (err) {
		if (err) {
			req.flash("error", "Something went wrong with the database")
			return res.redirect("back")
		} else {
			req.flash("success", "Successfully Deleted Production Report")
			res.redirect("/production")
		}
	})
})


module.exports = router;
