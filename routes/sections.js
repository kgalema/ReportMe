const express = require("express")
const router = express.Router()
const Section = require("../models/section")
const User = require("../models/user")
const Shift = require("../models/shift")
const { isLoggedIn, isSectionAuthor } = require("../middleware")


//================
// Sections routes
//================

// 1. Index route -list all sections sections
router.get("/sections", function (req, res) {
	Section.find({}, function (err, allSections) {
		if (err || !allSections) {
			req.flash("error", "Error occured while fetching all sections");
			return res.redirect("/");
		}
		res.render("sections/index", { sections: allSections, title: "sections" })
	}).sort("name")
})

// 2. New route - renders a for creating new section
router.get("/sections/new", isLoggedIn, function (req, res) {
	User.find({ occupation: "Mine_Overseer" }, function (err, allMOs) {
    	if (err || !allMOs) {
      		req.flash("error", "Error occured while fetching MOs");
      		return res.redirect("/sections");
    	}
    	res.render("sections/new", { title: "sections", mineOverseers: allMOs });
  });
})

// 3. Create route - post a new section into the database then redirect elsewhere
router.post("/sections", isLoggedIn, function (req, res) {
	User.findById(req.body.section.mineOverseer, function(err, foundUser){
		if(err || !foundUser){
			req.flash("error", "Provided MO does not exist");
			return res.redirect("sections");
		}
		req.body.section.author = req.user._id;
		req.body.section.mineOverseer = {
			_id : foundUser._id,
			name: foundUser.username
		}
		Section.create(req.body.section, function (err, newSection) {
			if (err || !newSection) {
				req.flash("error", "Error occured while creating new section")
				return res.redirect("sections/new")
			}
			req.flash("success", "Successfully added new section")
			res.redirect("/sections")
		});
	});
});

// 4. Show route - shows/get info about one specific section
router.get("/sections/:id", function (req, res) {
	Shift.find({}, function(err, shifts){
		if(err || !shifts){
			req.flash("error", "Error occured while fetching shifts");
			return res.redirect("/sections");
		}
		let redirect = "/"
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
				// const sortedShifts = shifts
				res.render("sections/show", { shifts, section: foundSection, title: "sections" })
			}
		});
	});
});

// 5. Edit route - renders edit form to edit one particular section
router.get("/sections/:id/edit", isLoggedIn, isSectionAuthor, function (req, res) {
	Section.findById(req.params.id, function (err, section) {
		if (err || !section) {
			req.flash("error", "Section with provided ID does not exist")
			return res.redirect("back")
		} 
		User.find({ occupation: "Mine_Overseer" }, function (err, allMOs) {
      		if (err || !allMOs) {
        		req.flash("error", "Error occured while fetching MOs");
        		return res.redirect("/sections");
      		}
			res.render("sections/edit", { section: section, title: "sections", mineOverseers: allMOs })
    	});
	})
})

// 6. Update route - Puts edited info about one particular section in the database
router.put("/sections/:id", isLoggedIn, isSectionAuthor, function (req, res) {
	User.findById(req.body.section.mineOverseer, function(err, foundUser){
		if(err || !foundUser){
			req.flash("error", "MO does not exist");
			return res.redirect("back");
		}
		req.body.section.mineOverseer = {
			_id: foundUser._id,
			name: foundUser.username,
		};
		Section.findByIdAndUpdate(req.params.id, req.body.section, function (err, updatedSection) {
			if (err || !updatedSection) {
				req.flash("error", "Update went wrong. Contact admin");
				return res.redirect("/sections");
			} 
			req.flash("success", "Successfully updated section");
			res.redirect("/sections/" + req.params.id);
		});
	});
});

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