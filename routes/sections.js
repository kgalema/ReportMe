const express = require("express")
const router = express.Router()
const Section = require("../models/section")
const { isLoggedIn, isSectionAuthor } = require("../middleware")


//================
// Sections routes
//================

// 1. Index route -list all sections sections
router.get("/sections", function (req, res) {
	Section.find({}, function (err, allSections) {
		if (err || !allSections) {
			return res.redirect("/")
		} else {
			res.render("sections/index", { sections: allSections, title: "sections" })
		}
	})
})

// 2. New route - renders a for creating new section
router.get("/sections/new", isLoggedIn, function (req, res) {
	res.render("sections/new", { title: "sections" })
})
// 3. Create route - post a new section into the database then redirect elsewhere
router.post("/sections", isLoggedIn, function (req, res) {
	Section.create(req.body.section, function (err, newSection) {
		if (err) {
			return res.render("sections/new", { title: "section" })
		} else {
			newSection.author = req.user._id
			newSection.save(function (err, savedSection) {
				if (err) {
					req.flash("error", "Something went wrong")
					return res.redirect("back")
				}
				req.flash("success", "Successfully added new section")
				res.redirect("/sections")
			})
		}
	});
})
// 4. Show route - shows/get info about one specific section
router.get("/sections/:id", function (req, res) {
	// Section.findById(req.params.id).populate("redPanels").exec(function (err, foundSection) {
	Section.findById(req.params.id, function (err, foundSection) {
		if (err || !foundSection) {
			req.flash("error", "Invalid Section ID")
			return res.redirect("back")
		} else if (req.session.returnTo) {
			switch (req.session.returnTo) {
				case "/sections/sectionId/production/new":
					redirect = "/production/new";
					break;
				case "/sections/sectionId/newReds/new":
					redirect = "/newReds/new";
					break;
				}
			delete req.session.returnTo;
			return res.redirect("/sections/"+ foundSection._id + redirect)
		} else {
			res.render("sections/show", { section: foundSection, title: "sections" })
		}
	});
})

// 5. Edit route - renders edit form to edit one particular section
router.get("/sections/:id/edit", isLoggedIn, isSectionAuthor, function (req, res) {
	Section.findById(req.params.id, function (err, section) {
		if (err) {
			return res.redirect("back")
		} else {
			res.render("sections/edit", { section: section, title: "sections" })
		}
	})
})
// 6. Update route - Puts edited info about one particular section in the database
router.put("/sections/:id", isLoggedIn, isSectionAuthor, function (req, res) {
	Section.findByIdAndUpdate(req.params.id, req.body.section, function (err, updatedSection) {
		if (err) {
			return res.redirect("back")
		} else {
			req.flash("success", "Successfully updated section")
			res.redirect("/sections/" + req.params.id)
		}
	})
})
// 7. Destroy route - Deletes a particular section 
router.delete("/sections/:id", isLoggedIn, isSectionAuthor, function (req, res) {
	Section.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			return res.redirect("back")
		} else {
			req.flash("success", "Successfully deleted section")
			res.redirect("/sections")
		}
	})
})

module.exports = router;