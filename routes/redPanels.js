const express = require("express")
const router = express.Router()
const path = require("path")
const crypto = require("crypto")
const Section = require("../models/section")
const Redpanel = require("../models/tarp")
const User = require("../models/user")
const NewRedPanel = require("../models/newRed")
const { isLoggedIn, isAuthor, isConnectionOpen } = require("../middleware")
const ExpressError = require("../utils/ExpressError")
const nodemailer = require("nodemailer")


const GridFsStorage = require("multer-gridfs-storage")
const multer = require("multer")
const mongoose = require("mongoose")

const exported = require("../app")


const dbUrl = exported.dbUrl;
const connection = exported.connection;



// Create storage engine
const storage2 = new GridFsStorage({
	url: dbUrl,
	options: { useNewUrlParser: true, useUnifiedTopology: true },
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				const filename = buf.toString("hex") + path.extname(file.originalname);
				const fileInfo = {
					filename: filename,
					bucketName: "reds"
				}
				resolve(fileInfo)
			})
		})
	}
})


let gfs
connection.once("open", () => {
	gfs = new mongoose.mongo.GridFSBucket(connection.db, {bucketName: "reds"})
})


const upload2 = multer({ storage: storage2 })



//======================
//TARP Red panels routes
//======================

// 1. Index routes -renders a list for all red panels
router.get("/redPanel", isConnectionOpen, function (req, res) {
	Redpanel.find({}, function (err, redpanels) {
		if (err || !redpanels) {
			req.flash("error", "Error occured while fetching data");
			return res.redirect("back");
		}
		NewRedPanel.find({}, function (err, newRedPanels) {
			if (err || !newRedPanels) {
				req.flash("error", "Error occured while fetching data");
				return res.redirect("back");
			}
			Section.find({}, function(err, sections){
				if(err || !sections){
					console.log(err)
				}
				console.log(sections)
				res.render("redPanels/index", { sections, redpanels: redpanels, newRedPanels: newRedPanels, title: "TARP-Red" });
			})
		});
	});
});

// 2. New Route - renders a form for red panels
router.get("/sections/:id/redPanel/new", isConnectionOpen, isLoggedIn, function (req, res) {
	Section.findById(req.params.id, function (err, foundSection) {
		if (err || !foundSection) {
			req.flash("error", "Error while fetching section data");
			return res.redirect("back");
		} else {
			NewRedPanel.findById(req.query.q, function (err, foundNewRed) {
				if (err || !foundNewRed) {
					req.flash("error", "Error while fetching red panel data");
					return res.redirect("back");
				}
				res.render("redPanels/new", { queryId: req.query.q, section: foundSection, redPanel: foundNewRed, title: "TARP-Red" });
			});
		}
	});
});

// 3. Create route - creates a tarp red panel data
router.post("/sections/:id/redPanels", isConnectionOpen, isLoggedIn, upload2.single("issuedReport"), function (req, res, next) {
	Section.findById(req.params.id, function (err, section) {
		if (err || !section) {
			req.flash("error", "Error while fetching section information");
			return res.redirect("back");
		}
		Redpanel.create(req.body.redPanel, function (err, createdRedIssued) {
			if (err || !createdRedIssued) {
				req.flash("error", "Could not create an Active Red Panel");
				return res.redirect("back");
			}
			createdRedIssued.fileID = req.file.id;
			createdRedIssued.section.id = section._id;
			createdRedIssued.section.name = section.name;
			createdRedIssued.author = req.user._id;
			createdRedIssued.save(function (err, doc) {
				if (err || !doc) {
					req.flash("error", "Could not associate created active red panel with section");
					return res.redirect("back");
				}
				NewRedPanel.findByIdAndRemove(req.query.q, function (err) {
					if (err) {
						req.flash("error", "Could not delete panel from awaiting visit panels");
						return req.redirect("redPanel");
					}
					req.flash("success", "Active Red Panel Created. Report available");
					res.redirect("/redPanel");
				});
			});
		});
	});
});


// 4. Show route - shows info about one specific redpanel
router.get("/redPanel/:id", isConnectionOpen, function (req, res, next) {
	Redpanel.findById(req.params.id, function (err, foundRedPanel) {
		if (err || !foundRedPanel) {
			req.flash("error", "Cannot find requested TARP Red panel");
			return res.redirect("/redPanel");
		}
		User.find({ _id: { $in: [foundRedPanel.newRedAuthor, foundRedPanel.author] } }, { preferredName: 1 }, function (err, user) {
			if (err || !user) {
				req.flash("error", "Looks like the TARP red panel does not have author");
				return res.redirect("back");
			}
			let redAuthors = user;
			if (user.length === 1) {
				redAuthors = [...user, ...user];
			}
			res.render("redPanels/show", { redPanel: foundRedPanel, redAuthors, title: "TARP-Red" });
		});
	});
});

// 4.1 Downloading the stored file
router.get("/sections/:id/redPanels/:redpanel_id/download", isConnectionOpen, function (req, res) {
	Redpanel.findById(req.params.redpanel_id, function (err, foundRed) {
		if (err || !foundRed) {
			req.flash("error", "Cannot find requested TARP Red panel");
			return res.redirect("/redPanel");
		} else {
			let ID = new mongoose.Types.ObjectId(foundRed.fileID);
			gfs.find({ _id: ID }).toArray((err, file) => {
				if (err || !file[0]) {
					req.flash("error", "Error while fetching the file");
					return res.redirect("back");
				}
				res.writeHead(200, {
					"Content-Type": file[0].contentType,
					"Content-Disposition": "attachment; filename=" + foundRed.reportNumber + ".pdf",
				});

				const readstream = gfs.openDownloadStreamByName(file[0].filename);
				readstream.pipe(res);
			});
		}
	});
});

// 5. Edit route - Edit a specific redpanel (Renders a form)
router.get("/sections/:id/redPanels/:redpanel_id/edit", isConnectionOpen, isLoggedIn, isAuthor, function (req, res) {
	Redpanel.findById(req.params.redpanel_id, function (err, foundRed) {
		if (err || !foundRed) {
			req.flash("error", "Cannot find requested TARP Red panel");
			return res.redirect("/redPanel");
		} else {
			res.render("redPanels/edit", { section_id: req.params.id, redpanel: foundRed, title: "TARP-Red" });
		}
	});
});

// 6. Update route - Puts the supplied info from edit form into the database
router.put("/sections/:id/redPanels/:redpanel_id", isConnectionOpen, isLoggedIn, isAuthor, upload2.single("issuedReport"), function (req, res) {
	Redpanel.findByIdAndUpdate(req.params.redpanel_id, req.body.redPanel, function (err, updatedRedpanel) {
		if (err || !updatedRedpanel) {
			req.flash("error", "Cannot find requested TARP Red panel");
			return res.redirect("/redPanel");
		} else if (req.file) {
			gfs.delete(new mongoose.Types.ObjectId(updatedRedpanel.fileID), function (err, storage) {
				if (err) {
					req.flash("error", "Error while removing old recommendation");
					return res.status(404).redirect("/redPanel");
				}
				updatedRedpanel.fileID = req.file.id;
				updatedRedpanel.save(function (err, savedUpdated) {
					if (err) {
						req.flash("error", "error while saving updated red panel");
						return res.status(404).redirect("/redPanel");
					}
					req.flash("success", "Successfully updated a TARP Red panel");
					return res.redirect("/redPanel/" + req.params.redpanel_id);
				});
			});
		} else {
			req.flash("success", "Successfully updated a TARP Red panel");
			return res.redirect("/redPanel/" + req.params.redpanel_id);
		}
	});
});
// 7. Delete route - Delete particular red panel
router.delete("/sections/:id/redPanels/:redpanel_id", isConnectionOpen, isLoggedIn, isAuthor, function (req, res) {
	Redpanel.findById(req.params.redpanel_id, function (err, foundRed) {
		if (err) {
			req.flash("error", "Oops! Something went wrong or panel is already deleted");
			return res.redirect("/redPanel");
		}
		Redpanel.findByIdAndDelete(req.params.redpanel_id, function (err) {
			if (err) {
				req.flash("error", "Error While Deleting Red Panel Data");
				return res.redirect("/redPanel");
			}
			gfs.delete(new mongoose.Types.ObjectId(foundRed.fileID), function (err, data) {
				if (err) {
					req.flash("error", "Error While Deleting Recommendation. Red Panel Data Deleted");
					return res.redirect("/redPanel");
				}
				req.flash("success", "Successfully deleted a TARP red panel");
				res.redirect("/redPanel");
			});
		});
	});
});


module.exports = router;