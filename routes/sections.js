const express = require("express")
const router = express.Router()
const Section = require("../models/section")
const User = require("../models/user")
const Shift = require("../models/shift")
const { isLoggedIn, isSectionAuthor, isConnectionOpen } = require("../middleware");


//================
// Sections routes
//================

// 1. Index route -list all sections sections
router.get("/sections", isConnectionOpen, function (req, res) {
	Section.find({}, function (err, allSections) {
		if (err || !allSections) {
			req.flash("error", "Error occured while fetching all sections");
			return res.redirect("/");
		}
		const collator = new Intl.Collator(undefined, {
			numeric: true,
			sensitivity: "base",
		});

		const sorted = allSections.sort(function (a, b) {
			return collator.compare(a.name, b.name);
		});
		res.render("sections/index", { sections: sorted, title: "sections" });
	})
});

// 2. New route - renders a for creating new section
router.get("/sections/new", isConnectionOpen, isLoggedIn, function (req, res) {
	User.find({ occupation: "Mine_Overseer" }, function (err, allMOs) {
		if (err || !allMOs) {
			req.flash("error", "Error occured while fetching MOs");
			return res.redirect("/sections");
		}
		console.log(allMOs);
		res.render("sections/new", { title: "sections", mineOverseers: allMOs });
	});
});

// 3. Create route - post a new section into the database then redirect elsewhere
router.post("/sections", isConnectionOpen, isLoggedIn, function (req, res) {
	User.findById(req.body.section.mineOverseer, function (err, foundUser) {
		if (err || !foundUser) {
			req.flash("error", "Provided MO does not exist");
			return res.redirect("sections");
		}
		req.body.section.author = req.user._id;
		req.body.section.mineOverseer = {
			_id: foundUser._id,
			name: foundUser.preferredName,
		};
		Section.create(req.body.section, function (err, newSection) {
			if (err || !newSection) {
				req.flash("error", "Error occured while creating new section");
				return res.redirect("sections/new");
			}
			req.flash("success", "Successfully added new section");
			res.redirect("/sections");
		});
	});
});

// 4. Show route - shows/get info about one specific section
router.get("/sections/:id", isConnectionOpen, function (req, res) {
	Shift.find({}, function (err, shifts) {
		if (err || !shifts) {
			req.flash("error", "Error occured while fetching shifts");
			return res.redirect("/sections");
		}
		let redirect = "";
		Section.findById(req.params.id, function (err, foundSection) {
			if (err || !foundSection) {
				req.flash("error", "Invalid Section ID");
				return res.redirect("back");
			} else if (req.session.goTo) {
				switch (req.session.goTo) {
					case "/sections/sectionId/production/new":
						redirect = "/production/new";
						break;
					case "/sections/sectionId/newReds/new":
						redirect = "/newReds/new";
						break;
				}
				delete req.session.goTo;
				return res.redirect("/sections/" + foundSection._id + redirect);
			} else {
				res.render("sections/show", { shifts, section: foundSection, title: "sections" });
			}
		});
	});
});

// 5. Edit route - renders edit form to edit one particular section
router.get("/sections/:id/edit", isConnectionOpen, isLoggedIn, isSectionAuthor, function (req, res) {
	Section.findById(req.params.id, function (err, section) {
		if (err || !section) {
			req.flash("error", "Section with provided ID does not exist");
			return res.redirect("back");
		}
		User.find({ occupation: "Mine_Overseer" }, { preferredName: 1 }, function (err, allMOs) {
			if (err || !allMOs) {
				req.flash("error", "Error occured while fetching MOs");
				return res.redirect("/sections");
			}
			res.render("sections/edit", { section: section, title: "sections", mineOverseers: allMOs });
		});
	});
});

// 6. Update route - Puts edited info about one particular section in the database
router.put("/sections/:id", isConnectionOpen, isLoggedIn, isSectionAuthor, function (req, res) {
	console.log(req.body.section);
	const MOObject = req.body.section.mineOverseer.split("&");
	req.body.section.mineOverseer = { _id: MOObject[0], name: MOObject[1] };
	console.log(req.body.section);

	Section.findByIdAndUpdate(req.params.id, req.body.section, function (err, updatedSection) {
		if (err || !updatedSection) {
			req.flash("error", "Update went wrong. Contact admin");
			return res.redirect("/sections");
		}
		req.flash("success", "Successfully updated section");
		res.redirect("/sections/" + req.params.id);
	});
});

// 7. Destroy route - Deletes a particular section 
router.delete("/sections/:id", isConnectionOpen, isLoggedIn, isSectionAuthor, function (req, res) {
	Section.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			return res.redirect("back");
		} else {
			req.flash("success", "Successfully deleted section");
			res.redirect("/sections");
		}
	});
});

module.exports = router;