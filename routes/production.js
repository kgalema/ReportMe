const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Section = require("../models/section");
const Production = require("../models/production");
const TMM = require("../models/tmms");
const User = require("../models/user");
const Shift = require("../models/shift");
const ProductionCalendar = require("../models/productionCalendar");
const { isLoggedIn, isProductionAuthor, isSectionSelected, isAdmin, isConnectionOpen } = require("../middleware");

const GridFsStorage = require("multer-gridfs-storage");
const multer = require("multer");
const path = require("path");

const exported = require("../app");

// Create storage engine
const storage = new GridFsStorage({
	url: exported.dbUrl,
	options: { useNewUrlParser: true, useUnifiedTopology: true },
	file: (req, file) => {
		const filename = "declaration" + req.query.code + path.extname(file.originalname);
		const fileInfo = {
			filename: filename,
			bucketName: "declarations",
		};

		return fileInfo;
	},
});

const upload = multer({ storage });

const collator = new Intl.Collator(undefined, {
	numeric: true,
	sensitivity: "base",
});

// 1. Landing Route
router.get("/", function (req, res) {
	console.log("Production route");
	Production.find({})
		.populate("section.id")
		.exec(function (err, productions) {
			if (err || !productions) {
				req.flash("error", "Oops! Error occured while fetching production reports");
				return res.redirect("back");
			}

			Shift.find({}, { isBlasting: 1, name: 1, start: 1 }, function (err, shifts) {
				if (err || !shifts) {
					req.flash("error", "Error occured while validating shifts");
					return res.redirect("back");
				}

				res.render("index", { productions, shifts });
			});
		});
});

// 1. ***Index route: Shows you all captured reports***
router.get("/production", isConnectionOpen, function (req, res) {
	Production.find({}, function (err, allProduction) {
		if (err || !allProduction) {
			req.flash("error", "Oops! Error occured while fetching production reports");
			return res.redirect("back");
		}
		Section.find({}, function (err, sections) {
			if (err || !sections) {
				req.flash("error", "Error occured while fetching sections");
				return res.redirect("back");
			}
			Shift.find({}, { isBlasting: 1, name: 1, start: 1 }, function (err, shifts) {
				if (err || !shifts) {
					req.flash("error", "Error occured while validating shifts");
					return res.redirect("back");
				}
				const sortedProductions = allProduction.sort(function (a, b) {
					return collator.compare(a.section.name, b.section.name);
				});
				res.render("production/index", { production: sortedProductions, shifts, sections, title: "production-dash" });
			});
		});
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
			const drillRigs = sorted.filter(dR => dR.category === "drillRigs");
			const LHDs = sorted.filter(LHD => LHD.category === "LHDs");
			const bolters = sorted.filter(LHD => LHD.category === "bolters");
			ProductionCalendar.find({}, { date: 1, _id: 0 }, function (err, foundDates) {
				if (err || !foundDates) {
					req.flash("error", "Error while retrieving production days");
					return res.redirect("/production");
				}
				Shift.find({}, function (err, shifts) {
					if (err || !shifts) {
						req.flash("error", "Error occured while retrieving shifts");
						return res.redirect("/production");
					}
					const foundDates1 = foundDates.map(e => e.date);
					const blasting = shifts
						.filter(s => s.isBlasting)
						.map(arr => arr.name.toLowerCase())
						.reduce((a, b) => a + b, "");

					Production.find({ "section.name": foundSection.name, "general.shift": blasting, "blast.isMeasured": false }, { blast: 1, "general.shiftStart": 1 }, function (err, productionFound) {
						const panelsAdvanced = [];
						const panelsAdvancedDate = [];
						productionFound.forEach(e => {
							panelsAdvancedDate.push(e.general[0].shiftStart);
							e.blast.forEach(b => {
								b.shiftStart = e.general[0].shiftStart;
								panelsAdvanced.push(b);
							});
						});
						res.render("production/new", { panelsAdvanced, panelsAdvancedDate, shifts, foundDates1, section: foundSection, drillRigs, LHDs, bolters, title: "production-dash" });
					});
				});
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

		if (req.body.production.blast && req.body.production.blast.length > 0) {
			req.body.production.blast.forEach(b => {
				if (b.length == 0) {
					b.isMeasured = true;
					b.isCleaned = true;
					b.panel = "NONE";
				}
			});
		}

		Shift.find({ name: req.body.production.general[0].shift.toUpperCase() }, function (err, shift) {
			if (err || !shift) {
				req.flash("error", "Error occured while validating production shift");
				return res.redirect("/production");
			}
			if (shift[0].overlap === true) {
				const cr = req.body.production.created;
				const yesterday = new Date(cr);
				yesterday.setDate(yesterday.getDate() - 1);
				req.body.production.general[0].shiftStart = yesterday;
			} else {
				req.body.production.general[0].shiftStart = req.body.production.created;
			}

			Production.create(req.body.production, function (err, foundProduction) {
				if (err || !foundProduction) {
					req.flash("error", "Looks like you are trying to create duplicate report");
					return res.redirect("/production");
				}

				foundProduction.section.id = section._id;
				foundProduction.section.name = section.name;
				if (foundProduction.general[0].isProduction) {
					foundProduction.section.budget = section.budget;
					foundProduction.section.forecast = section.forecast;
				}

				foundProduction.blast.forEach(b => {
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
						const ids = req.body.advanceEdit.blast.map(e => e.id);
						const arr = req.body.advanceEdit.blast;
						Production.find({ "section.name": section.name, "blast._id": { $in: ids } }, function (err, foundBlast) {
							if (err || !foundBlast) {
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
			const dateCreated = foundProduction.general[0].shiftStart;
			const time = foundProduction.createdAt;
			const currentTime = new Date();

			dateCreated.setHours(time.getHours());
			dateCreated.setMinutes(time.getMinutes());
			dateCreated.setSeconds(time.getSeconds());

			const expiredat1 = new Date(dateCreated);

			const expiresAt = new Date(expiredat1.setHours(expiredat1.getHours() + 1));
			let expired = false;
			if (currentTime > expiresAt) {
				expired = true;
			}
			res.render("production/showProduction", { expired, reported: foundProduction, reportedUser: user, title: "production-dash" });
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
			const drillRigs = sorted.filter(dR => dR.category === "drillRigs");
			const LHDs = sorted.filter(LHD => LHD.category === "LHDs");
			const bolters = sorted.filter(LHD => LHD.category === "bolters");
			ProductionCalendar.find({}, { date: 1, _id: 0 }, function (err, foundDates) {
				if (err || !foundDates) {
					req.flash("error", "Error while retrieving production days");
					return res.redirect("/production");
				}

				const foundDates1 = foundDates.map(e => e.date);
				res.render("production/edit", { foundDates1, production: foundProduction, drillRigs, LHDs, bolters, title: "production-dash" });
			});
		});
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
	Production.findById(req.params.production_id, function (err, production) {
		if (err || !production) {
			req.flash("error", "Error ocured while validating production report");
			req.redirect("/production");
		}
		Production.findByIdAndRemove(req.params.production_id, function (err) {
			if (err) {
				req.flash("error", "Something went wrong with the database");
				return res.redirect("back");
			}

			if (production.declaration.isAttached) {
				const gfsR = new mongoose.mongo.GridFSBucket(req.DBconnection, { bucketName: "declarations" });

				gfsR.delete(new mongoose.Types.ObjectId(production.declaration.id), function (err) {
					if (err) {
						req.flash("error", "Error occured while deleting declaration. Please let admin know of this error");
						return res.redirect("/production");
					}
					req.flash("success", "Successfully deleted production report");
					return res.redirect("/production");
				});
			}

			req.flash("success", "Successfully deleted production report");
			res.redirect("/production");
		});
	});
});

/*****************Routes For Declaration Uploads ****************/

// 1. This route renders a new form for declaration upload
router.get("/declaration/production/:production_id/new", isConnectionOpen, isLoggedIn, function (req, res) {
	Production.findById(req.params.production_id, function (err, production) {
		if (err || !production) {
			req.flash("error", "An error occured while retrieving info about selected production report");
			return req.redirect(`/production/${req.params.production_id}`);
		}
		res.render("production/declarations/new", { what: req.query.what, production, title: "production-dash" });
	});
});

// 2. This route post and saves the uploaded declaration into the database
router.post("/declaration/production/:production_id", isConnectionOpen, isLoggedIn, upload.single("page"), function (req, res) {
	Production.findById(req.params.production_id, function (err, production) {
		if (err || !production) {
			req.flash("error", "An error occured while retrieving info about selected production report");
			return res.redirect(`/production/${req.params.production_id}`);
		}
		// return res.redirect()
		production.declaration = {
			isAttached: true,
			id: req.file.id,
			author: req.user.preferredName,
			authorID: req.user._id,
			date: new Date(),
		};

		production.save(function (err, saved) {
			if (err || !saved) {
				req.flash("error", "Error occured while updating production report");
				return res.redirect(req.headers.referer);
			}
			res.redirect(`/sections/${production.section.id}/production/${production._id}`);
		});
	});
});

// 3. Declaration Edit - This route edit existing declaration by removing old one and saving new one in the data base
router.post("/declaration/production/:production_id/edit", isConnectionOpen, isLoggedIn, upload.single("page"), function (req, res) {
	Production.findById(req.params.production_id, function (err, production) {
		if (err || !production) {
			req.flash("error", "An error occured while retrieving info about selected production report");
			return res.redirect(`/production/${req.params.production_id}`);
		}

		const fileToDelete = production.declaration.id;
		production.declaration.id = req.file.id;

		production.save(function (err, saved) {
			if (err || !saved) {
				req.flash("error", "Error occured while updating file id in the production report");
				return res.redirect(`/production/${req.params.production_id}`);
			}

			const gfs = new mongoose.mongo.GridFSBucket(req.DBconnection, { bucketName: "declarations" });

			gfs.delete(new mongoose.Types.ObjectId(fileToDelete), function (err) {
				if (err) {
					req.flash("error", "Error occured while replacing existing declaration. Contact admin");
					return res.redirect(`/sections/${production.section.id}/production/${production._id}`);
				}
				req.flash("success", "Successfully edited declaration book");
				res.redirect(`/sections/${production.section.id}/production/${production._id}`);
			});
		});
	});
});

// 4. Downloading declaration
router.post("/declaration/production/:production_id/download", isConnectionOpen, upload.single("page"), function (req, res) {
	Production.findById(req.params.production_id, function (err, production) {
		if (err || !production) {
			req.flash("error", "An error occured while retrieving info about selected production report");
			return res.redirect(`/production/${req.params.production_id}`);
		}
		const fName = "declaration" + production.uniqueCode + ".pdf";
		const gfsR = new mongoose.mongo.GridFSBucket(req.DBconnection, { bucketName: "declarations" });

		gfsR.find({ filename: fName }).toArray((err, file) => {
			if (err || !file[0]) {
				req.flash("error", "Error occured while downloading file");
				return res.redirect(req.headers.referer);
			}

			res.writeHead(200, {
				"Content-Type": file[0].contentType,
				"Content-Disposition": "attachment; filename=" + fName + ".pdf",
			});

			const readstream = gfsR.openDownloadStreamByName(file[0].filename);
			readstream.pipe(res);
		});
	});
});

// Seeding the data base
// Non-blasting shifting
router.get("/production/night/seed", isConnectionOpen, isAdmin, function (req, res) {
	const date = new Date("2023-04-01T00:00:00.000Z");
	const dates = [];
	const arrToInsert = [];

	while (date <= new Date()) {
		dates.push(date.toLocaleDateString());
		date.setDate(date.getDate() + 1);
	}

	dates.forEach(d => {
		const production = {
			section: {
				budget: 0,
				forecast: 0,
				id: "5fc8dcd9f1cc9f4e1cd9a191",
				name: "SECTION_1",
				plannedAdvance: 2.7,
			},
			declaration: { isAttached: false },
			general: [
				{
					shift: "night",
					isProduction: false,
					comments: "Hello there!",
					shiftStart: d,
				},
			],
			blast: [
				{
					isCleaned: true,
					isMeasured: true,
					panel: "NONE",
					length: 0,
					advance: 2.7,
				},
			],
			clean: [
				{ panel: "WINZE26", length: 8 },
				{ panel: "109E", length: 8 },
				{ panel: "102E", length: 8 },
			],
			support: [
				{
					panel: "108WINZE",
					length: 6,
					bolts: 12,
					anchors: 6,
					machine: "RB01",
				},
			],
			drill: [
				{
					panel: "87W",
					length: 8,
					holes: 54,
					drillRig: "GST01",
				},
			],
			prep: [{ panel: "6E", length: 8 }],
			notClean: [{ panel: "82W", length: 8 }],
			LHD: [
				{
					coyNumber: 119319,
					LHDnumber: "GL89",
					buckets: 57,
				},
			],
			uniqueCode: "SECTION_1" + d + "night",
			author: req.user._id,
		};

		arrToInsert.push(production);
	});

	Production.insertMany(arrToInsert, function (err, inserted) {
		if (err || !inserted) {
			console.log(err.message);
			req.flash("error", "Error occured while inserting documents");
			return res.redirect("/production");
		}
		console.log(inserted.length);
		res.send("Successfully seeded database");
	});
});

// Blasting Shift
router.get("/production/day/seed", isConnectionOpen, isAdmin, function (req, res) {
	const date = new Date("2023-04-01T00:00:00.000Z");
	const dates = [];
	const arrToInsert = [];

	while (date <= new Date()) {
		dates.push(date.toLocaleDateString());
		date.setDate(date.getDate() + 1);
	}

	dates.forEach(d => {
		const production = {
			section: {
				budget: 0,
				forecast: 0,
				id: "5fc8dcd9f1cc9f4e1cd9a191",
				name: "SECTION_1",
				plannedAdvance: 2.7,
			},
			declaration: { isAttached: false },
			general: [
				{
					shift: "morning",
					isProduction: false,
					comments: "Hello there!",
					shiftStart: d,
				},
			],
			blast: [
				{
					isCleaned: true,
					isMeasured: true,
					panel: "58E",
					length: 8,
					advance: 2.3,
				},
				{
					isCleaned: true,
					isMeasured: true,
					panel: "58EH",
					length: 6,
					advance: 2.4,
				},
				{
					isCleaned: true,
					isMeasured: true,
					panel: "59E",
					length: 10,
					advance: 2.7,
				},
				{
					isCleaned: true,
					isMeasured: true,
					panel: "60E",
					length: 8,
					advance: 2.6,
				},
			],
			clean: [
				{ panel: "WINZE26", length: 8 },
				{ panel: "109E", length: 8 },
				{ panel: "102E", length: 8 },
			],
			support: [
				{
					panel: "108WINZE",
					length: 6,
					bolts: 12,
					anchors: 6,
					machine: "RB01",
				},
			],
			drill: [
				{
					panel: "87W",
					length: 8,
					holes: 54,
					drillRig: "GST01",
				},
			],
			prep: [{ panel: "6E", length: 8 }],
			notClean: [{ panel: "82W", length: 8 }],
			LHD: [
				{
					coyNumber: 119319,
					LHDnumber: "GL89",
					buckets: 57,
				},
			],
			uniqueCode: "SECTION_1" + d + "morning",
			author: req.user._id,
		};

		arrToInsert.push(production);
	});

	Production.insertMany(arrToInsert, function (err, inserted) {
		if (err || !inserted) {
			console.log(err.message);
			req.flash("error", "Error occured while inserting documents");
			return res.redirect("/production");
		}
		console.log(inserted.length);
		res.send("Successfully seeded database for blasting shift");
	});
});

// Deleting all reports
router.get("/production/ronny/delete", isConnectionOpen, isAdmin, function (req, res) {
	Production.deleteMany({ "section.name": "SECTION_1" }, function (err) {
		if (err) {
			console.log(err.message);
			req.flash("error", "Error occured while inserting documents");
			return res.redirect("/production");
		}
		res.send("Successfully deleted many productions database");
	});

	// res.send("Successfully seeded database for blasting shift");
});

module.exports = router;
