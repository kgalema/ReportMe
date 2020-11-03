const express = require("express")
const router = express.Router()
const Section = require("../models/section")
const Redpanel = require("../models/tarp")
const Blast = require("../models/blast")
const Clean = require("../models/clean")
const Support = require("../models/support")
const Production = require("../models/production")




//===========================
// Production Reports Routes
//===========================

// 1. Landing Route
router.get("/", function (req, res) {
	res.render("welcomePage")
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
		} else {
			// console.log(allProduction)
			res.render("production/index", { production: allProduction })
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
router.get("/sections/:id/production/new", function (req, res) {
	Section.findById(req.params.id, function (err, foundSection) {
		if (err || !foundSection) {
			console.log(err);
			res.redirect("back")
		} else {
			// console.log(foundSection)
			res.render("production/new", { section: foundSection });
		}
	})
})


// 3. Create route - post the information into the database
router.post("/sections/:id/production", function (req, res) {
	Section.findById(req.params.id, function (err, section) {
		if (err || !section) {
			console.log(err);
			res.redirect("back");
		} else {
			// console.log(req.body.production)
			Production.create(req.body.production, function (err, foundProduction) {
				if (err) {
					console.log(err)
				} else {
					// console.log(report)
					foundProduction.section.id = section._id;
					foundProduction.section.name = section.name;
					// console.log(report);
					foundProduction.save();
					section.production.push(foundProduction);
					section.save();
					res.redirect("/production");
				}
			})
		}
	})
})




// 4. Show route: Shows info about 1 specific production report
router.get("/sections/:id/production/:production", function (req, res) {
	Production.findById(req.params.production, function (err, foundProduction) {
		if (err || !foundProduction) {
			console.log(err)
			res.redirect("back")
		} else {
			res.render("production/showProduction", { reported: foundProduction });
		}
	});
})

// 5. Edit - shows an edit production edit form
router.get("/sections/:id/production/:production_id/edit", function (req, res) {
	Production.findById(req.params.production_id, function (err, foundProduction) {
		if (err) {
			return res.redirect("/back")
		} else {
			res.render("production/edit", { production: foundProduction })
		}
	})
})
// 6. Update - takes info from edit form and PUTs it into existing data in the database
router.put("/sections/:id/production/:production_id", function (req, res) {
	Production.findByIdAndUpdate(req.params.production_id, req.body.production, function (err, updatedProduction) {
		if (err || !updatedProduction) {
			console.log(err)
			res.redirect("back")
		} else {
			console.log(updatedProduction)
			res.redirect("/sections/" + req.params.id + "/production/" + req.params.production_id)
		}
	})
})

// 7. Destroy - delete one specific production report
router.delete("/sections/:id/production/:production_id", function (req, res) {
	Production.findByIdAndRemove(req.params.production_id, function (err) {
		if (err) {
			res.redirect("back")
		} else {
			res.redirect("/production")
		}
	})
})


module.exports = router;
