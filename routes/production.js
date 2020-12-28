const express = require("express")
const router = express.Router()
const Section = require("../models/section")
const Redpanel = require("../models/tarp")
const Production = require("../models/production")
const moment = require("moment")
const { isLoggedIn, isProductionAuthor } = require("../middleware")




//===========================
// Production Reports Routes
//===========================

// 1. Landing Route
router.get("/", function (req, res) {
	// console.log(GMAILPW)
	res.render("welcomePage", { title: "home" })
})
// 			res.render("production/index", { sections: allSections })
// 		}
// 	})
// })

// 1. ***Index route: Shows you all captured reports***
router.get("/production", function (req, res) {
	Production.find({}, function (err, allProduction) {
		if (err) {
			console.log(err);
			req.flash("error", "Oops! Seems like the database is down. Please contact admin")
			return res.redirect("back")
		} else {
			res.render("production/index", { production: allProduction, title: "production-dash" })
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

// 2. **New route - renders production report form**
// router.get("/sections/:id/production/new", function (req, res) {
// 	Section.findById(req.params.id, function (err, foundSection) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			res.render("production/new", { section: foundSection });
// 		}
// 	})
// })

// 2. ***New route: Renders production report form***
router.get("/sections/:id/production/new", isLoggedIn, function (req, res) {
	Section.findById(req.params.id, function (err, foundSection) {
		if (err || !foundSection) {
			// console.log(err.castError);
			req.flash("error", "Oops! Seems like the database is down or section has been deleted")
			return res.redirect("back")
		} else {
			// console.log(foundSection)
			res.render("production/new", { section: foundSection, title: "production-report" });
		}
	})
})


// 3. Create route - post the information into the database
router.post("/sections/:id/production", isLoggedIn, function (req, res) {
	Section.findById(req.params.id, function (err, section) {
		if (err || !section) {
			console.log(err);
			req.flash("error", "Oops! Seems like the database is down or section has been deleted")
			return res.redirect("back");
		} else {
			console.log(section.name + new Date().toLocaleDateString() + req.body.production.general[0].shift)
			let uniqueCode = section.name + new Date().toLocaleDateString() + req.body.production.general[0].shift
			Production.create(req.body.production, function (err, foundProduction) {
				if (err) {
					console.log(err)
					req.flash("error", "Looks like you are trying to create duplicate report")
					return res.redirect("back")
				} else {
					foundProduction.section.id = section._id;
					foundProduction.section.name = section.name;
					foundProduction.uniqueCode = uniqueCode;
					foundProduction.author = req.user._id
					foundProduction.save(function (err, savedProduction) {
						if (err) {
							console.log(err)
							res.redirect("back")
						} else {
							console.log(savedProduction)
							// section.production.push(foundProduction);
							section.save(function (err, savedSection) {
								if (err) {
									console.log(err)
									res.redirect("back")
								} else {
									req.flash("success", "Successfully Added Production Report")
									res.redirect("/production");
								}
							});
						}
					});
					// section.production.push(foundProduction);
					// section.save();
					// req.flash("success", "Successfully Added Production Report")
					// res.redirect("/production");
				}
			})
		}
	})
})




// 4. Show route: Shows info about 1 specific production report
router.get("/sections/:id/production/:production_id", function (req, res) {
	Production.findById(req.params.production_id, function (err, foundProduction) {
		if (err || !foundProduction) {
			console.log(err)
			req.flash("error", "Oops! Seems like what you are looking for has vanished from the database")
			return res.redirect("back")
		} else {
			// console.log(foundProduction)
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
	Production.findByIdAndUpdate(req.params.production_id, req.body.production, function (err, updatedProduction) {
		if (err || !updatedProduction) {
			console.log(err)
			req.flash("error", "Something went wrong with the database")
			return res.redirect("back")
		} else {
			// console.log(updatedProduction)
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
