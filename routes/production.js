const express = require("express")
const router = express.Router()
const Section = require("../models/section")
const Production = require("../models/production")
const TMM = require("../models/tmms")
const User = require("../models/user")
const Shift = require("../models/shift")
const ProductionCalendar = require("../models/productionCalendar")
const { isLoggedIn, isProductionAuthor, isSectionSelected, isAdmin, isConnectionOpen } = require("../middleware")



//===========================
// Production Reports Routes
//===========================


const collator = new Intl.Collator(undefined, {
	numeric: true,
	sensitivity: "base",
});

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
			Shift.find({}, {isBlasting: 1, name: 1}, function(err, shifts){
				if(err || !shifts){
					req.flash("error", "Error occured while validating shifts");
					return res.redirect("back");
				}
				const sortedProductions = allProduction.sort(function (a, b) {
					return collator.compare(a.section.name, b.section.name);
				});
				res.render("production/index", { production: sortedProductions, shifts, sections, title: "production-dash" });
			})
		})
	});
});

router.get("/api/production", isConnectionOpen, function (req, res) {
	Production.find({}, function (err, allProduction) {
		if (err) {
			req.flash("error", "Oops! Seems like the database is down. Please contact admin");
			return res.redirect("back");
		} else {
			res.send(allProduction);
		}
	});
});



// 2. ***New route: Renders production report form***
router.get("/sections/:id/production/new", isConnectionOpen, isLoggedIn, isSectionSelected, function (req, res) {
	Section.findById(req.params.id, function (err, foundSection) {
		if (err || !foundSection) {
			req.flash("error", "Oops! Invalid Section ID. Section Not Found");
			return res.redirect("/production");
		}
		TMM.find({ category: { $in: ["LHDs", "drillRigs", "bolters"] } }, function (err, foundTMMs) {
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
			const drillRigs = sorted.filter((dR) => dR.category === "drillRigs");
			const LHDs = sorted.filter((LHD) => LHD.category === "LHDs");
			const bolters = sorted.filter((LHD) => LHD.category === "bolters");
			ProductionCalendar.find({}, {date: 1, _id: 0}, function(err, foundDates){
				if(err || !foundDates){
					req.flash("error", "Error while retrieving production days")
					return res.redirect("/production")
				}
				Shift.find({}, function(err, shifts){
					if(err || !shifts){
						req.flash("error", "Error occured while retrieving shifts");
						return res.redirect("/production");
					}
					const foundDates1 = foundDates.map(e => e.date)
					const blasting = shifts.filter(s => s.isBlasting).map(arr => arr.name.toLowerCase()).reduce((a, b) => a + b,"")

					Production.find({ "section.name": foundSection.name, "general.shift": blasting, "blast.isMeasured": false }, { blast: 1, "general.shiftStart": 1 }, function (err, productionFound) {
						const panelsAdvanced = [];
						const panelsAdvancedDate = []
						productionFound.forEach((e) => {
							panelsAdvancedDate.push(e.general[0].shiftStart)
							e.blast.forEach((b) => {
								b.shiftStart = e.general[0].shiftStart;
								panelsAdvanced.push(b);
							});
						});
						res.render("production/new", { panelsAdvanced, panelsAdvancedDate, shifts, foundDates1, section: foundSection, drillRigs, LHDs, bolters, title: "production-dash" });
					});
						
				})
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
		let dateNow = new Date().toLocaleDateString("en-GB");

		if (req.body.production.created) {
			dateNow = new Date(req.body.production.created).toLocaleDateString("en-GB");
		}
		const uniqueCode = section.name + dateNow + req.body.production.general[0].shift;
		req.body.production.uniqueCode = uniqueCode;

		if(req.body.production.blast && req.body.production.blast.length > 0){
			req.body.production.blast.forEach(b => {
				if(b.length == 0){
					b.isMeasured = true;
					b.isCleaned = true;
					b.panel = "NONE";
				}
			})
		};
		// console.log(req.body.production)
		// return res.json({})
		Production.create(req.body.production, function (err, foundProduction) {
			if (err || !foundProduction) {
				req.flash("error", "Looks like you are trying to create duplicate report");
				return res.redirect("/production");
			}

			if(foundProduction.general[0].shift === "night"){
				const cr = foundProduction.created
				const yesterday = new Date(cr);
				yesterday.setDate(yesterday.getDate() - 1);
				foundProduction.general[0].shiftStart = yesterday;
			} else {
				foundProduction.general[0].shiftStart = foundProduction.created;
			}

			foundProduction.section.id = section._id;
			foundProduction.section.name = section.name;
			if (foundProduction.general[0].isProduction) {
				foundProduction.section.budget = section.budget;
				foundProduction.section.forecast = section.forecast;
			}

			foundProduction.blast.forEach((b) => {
				b.advance = section.plannedAdvance;
			});
			foundProduction.section.plannedAdvance = section.plannedAdvance;
			foundProduction.author = req.user._id;


			foundProduction.save(function (err, savedProduction) {
				if (err || !savedProduction) {
					req.flash("error", "Error while saving production report");
					return res.redirect("back");
				}

				if (req.body.advanceEdit) {
					const ids = req.body.advanceEdit.blast.map((e) => e.id);
					const arr = req.body.advanceEdit.blast;
					Production.find({ "section.name": section.name, "blast._id": { $in: ids } }, function (err, foundBlast) {
						if(err || !foundBlast){
							req.flash("error", "Error while saving advances");
							return res.redirect("back");
						}
						foundBlast[0].blast.forEach((b, i) => {
							if (b._id == arr[i].id && b.panel === arr[i].panel && b.length === Number(arr[i].length)) {
								b.isMeasured = true;
								b.advance = arr[i].advance;
							}
						});

						foundBlast[0].save(function (err, saved) {
							if (err || !saved) {
								req.flash("error", "Error occured while updating advances of previously blasted areas");
								return res.redirect("/production");
							}
							req.flash("success", "Successfully added production report");
							res.redirect("/production");
						});
					});
				} else {
					req.flash("success", "Successfully added production report");
					res.redirect("/production");
				}
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
			const dateCreated = foundProduction.created;
			const time = foundProduction.createdAt;
			const currentTime = new Date()
			
			dateCreated.setHours(time.getHours());
			dateCreated.setMinutes(time.getMinutes());
			dateCreated.setSeconds(time.getSeconds());
			
			const expiredat1 = new Date(dateCreated);

			const expiresAt = new Date(expiredat1.setHours(expiredat1.getHours() + 1));
			let expired = false;
			if (currentTime > expiresAt) {
				expired = true
			}
			
			// These variables are necessary for triggering usage virtuals in the schema. They are all undefined
			const LHDUsage = foundProduction.LHDUsage;
			const bolterUsage = foundProduction.bolterUsage;
			const drillRigUsage = foundProduction.drillRigUsage;
			res.render("production/showProduction", {expired, reported: foundProduction, reportedUser: user, title: "production-dash" });
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
		TMM.find({ category: { $in: ["LHDs", "drillRigs", "bolters"] } }, function (err, foundTMMs) {
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
			const drillRigs = sorted.filter((dR) => dR.category === "drillRigs");
			const LHDs = sorted.filter((LHD) => LHD.category === "LHDs");
			const bolters = sorted.filter((LHD) => LHD.category === "bolters");
			ProductionCalendar.find({}, {date: 1, _id: 0}, function(err, foundDates){
				if (err || !foundDates) {
					req.flash("error", "Error while retrieving production days");
					return res.redirect("/production");
				}
				
				const foundDates1 = foundDates.map((e) => e.date);
				res.render("production/edit", { foundDates1, production: foundProduction, drillRigs, LHDs, bolters,title: "production-dash" });
			})
		})
	});
});
// 6. Update - takes info from edit form and PUTs it into existing data in the database
router.put("/sections/:id/production/:production_id", isConnectionOpen, isLoggedIn, isProductionAuthor, function (req, res) {
	Production.findByIdAndUpdate(req.params.production_id, req.body.production, function (err, updatedProduction) {
		if (err || !updatedProduction) {
			req.flash("error", "Something went wrong while updating production report");
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
