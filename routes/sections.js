const express = require("express")
const router = express.Router()
const Section = require("../models/section")


//================
// Sections routes
//================

// 1. Index route -list all sections sections
router.get("/sections", function (req, res) {
	Section.find({}, function (err, allSections) {
		if (err) {
			console.log(err);
		} else {
			res.render("sections/index", { sections: allSections })
		}
	})
})

// 2. New route - renders a for creating new section
router.get("/sections/new", function (req, res) {
	res.render("sections/new")
})
// 3. Create route - post a new section into the database then redirect elsewhere
router.post("/sections", function (req, res) {
	Section.create(req.body.section, function (err, newSection) {
		if (err) {
			console.log(err)
			res.render("sections/new")
		} else {
			console.log(req.body)
			// then redirect to the index route
			res.redirect("/sections")
		}
	});
})
// 4. Show route - shows/get info about one specific section
router.get("/sections/:id", function (req, res) {
	Section.findById(req.params.id).populate("redPanels").exec(function (err, foundSection) {
		if (err || !foundSection) {
			console.log(err)
			res.redirect("back")
		} else {
			console.log(foundSection)
			res.render("sections/show", { section: foundSection })
		}
	});
})

// 5. Edit route - renders edit form to edit one particular section
router.get("/sections/:id/edit", function (req, res) {
	Section.findById(req.params.id, function (err, section) {
		if (err) {
			res.redirect("back")
		} else {
			res.render("sections/edit", { section: section })
		}
	})
})
// 6. Update route - Puts edited info about one particular section in the database
router.put("/sections/:id", function (req, res) {
	Section.findByIdAndUpdate(req.params.id, req.body.section, function (err, updatedSection) {
		if (err) {
			res.redirect("back")
		} else {
			res.redirect("/sections/" + req.params.id)
		}
	})
})
// 7. Destroy route - Deletes a particular section 
router.delete("/sections/:id", function (req, res) {
	Section.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			res.redirect("back")
		} else {
			res.redirect("/sections")
		}
	})
})

module.exports = router;