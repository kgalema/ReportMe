const express = require("express");
const router  = express.Router();
const User = require("../models/user");
const Redpanel = require("../models/tarp");
const Rehab   = require("../models/rehab");
const { isLoggedIn, isRehabAuthor, isAdmin, isConnectionOpen } = require("../middleware");
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");


const exported = require("../app")

// Create storage engine
const storage2 = new GridFsStorage({
	url: exported.dbUrl,
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
					bucketName: "rehabs",
				};
				resolve(fileInfo)
			})
		})
	}
})

const upload2 = multer({ storage: storage2 });

const connection = exported.connection;


// 1. Index routes -renders a list for all Rehabiliated panels
router.get("/rehabedPanels", isConnectionOpen, function (req, res) {
	Rehab.find({}, function (err, rehabedPanels) {
		if (err || !rehabedPanels) {
			req.flash("error", "Error Occured While Fetching List Of Rehabilitated Panels");
			return res.redirect("back");
		}
		res.render("rehab/index", { rehabedPanels: rehabedPanels, title: "TARP-Red" });
	});
});
// 2. New Route - renders a form for new rehabed panel
router.get("/sections/:id/redPanels/:redpanel_id/rehabedPanel/new", isConnectionOpen, isLoggedIn, function (req, res) {
	Redpanel.findById(req.params.redpanel_id, function (err, foundRed) {
		if (err || !foundRed) {
			req.flash("error", "Error While Fetching Red Panel Data");
			return res.redirect("back");
		}
		res.render("rehab/new", { foundRed: foundRed, title: "TARP-Red" });
	});
});

// 3. Create route - creates a rehabed TARP red panel data
router.post("/sections/:id/redPanels/:redpanel_id/rehabedPanels", isConnectionOpen, isLoggedIn, upload2.single("signedReport"), function (req, res) {
	Redpanel.findById(req.params.redpanel_id, function (err, foundRed) {
		if (err || !foundRed) {
			req.flash("error, Error While Fetching Red Panel To Be Rehabilitaed");
			return res.redirect("back");
		}

		// const gfs2 = new mongoose.mongo.GridFSBucket(req.DBconnection, { bucketName: "rehabs" });

		const rehabedPanel = {
			panel: foundRed.panel,
			trigger: foundRed.trigger,
			reportNumber: foundRed.reportNumber,
			issueDate: foundRed.issueDate,
			declaredDate: foundRed.declaredDate,
			rehabDate: req.body.rehabed.rehabDate,
			section: {
				id: foundRed.section.id,
				name: foundRed.section.name,
			},
			author: req.user._id,
			authorRed: foundRed.author,
			authorNewRed: foundRed.newRedAuthor,
			fileID: foundRed.fileID,
			rehabedFileID: req.file.id
		};

		Rehab.create(rehabedPanel, function (err, rehab) {
			if (err || !rehab) {
				req.flash("error", "Error while creating a rehabilitated panel");
				return res.redirect("back");
			}

			Redpanel.findByIdAndDelete(req.params.redpanel_id, function (err) {
				if (err) {
					req.flash("error", "Error While Deleting Active Red Panel Data");
					return res.redirect("/redPanel");
				}
				req.flash("success", "Successfully rehabilited a TARP Red Panel");
				res.status(200).redirect("/rehabedPanels");
			});
		});
	});
});

// 4. Show route - shows info about one specific redpanel
router.get("/rehabedPanel/:id", isConnectionOpen, function (req, res) {
	Rehab.findById(req.params.id, function (err, foundRehabed) {
		if (err || !foundRehabed) {
			req.flash("error", "Cannot find requested Rehabilitated panel");
			return res.redirect("/rehabedPanels");
		}
		User.findById(foundRehabed.authorNewRed, { preferredName: 1 }, function (err, rehabedUser) {
			if (err || !rehabedUser) {
				req.flash("error", "Looks like rehabed panel panel does not have author");
				return res.redirect("back");
			}
			User.findById(foundRehabed.authorRed, { preferredName: 1 }, function (err, redUser) {
				if (err || !redUser) {
					req.flash("error", "Looks like red panel panel does not have author");
					return res.redirect("back");
				}
				User.findById(foundRehabed.author, { preferredName: 1 }, function (err, newRedUser) {
					if (err || !newRedUser) {
						req.flash("error", "Looks like new red panel panel does not have author");
						return res.redirect("back");
					}
					const authors = [rehabedUser, redUser, newRedUser];
					res.render("rehab/show", { rehabedPanel: foundRehabed, authors, title: "TARP-Red" });
				});
			});
		});
	});
});

// 4.1 Downloading the stored file
router.post("/sections/:id/rehabedPanels/:rehabedPanel_id/download", isConnectionOpen, function (req, res) {
	Rehab.findById(req.params.rehabedPanel_id, function (err, foundRehabed) {
		if (err || !foundRehabed) {
			req.flash("error", "Cannot Find Requested Rehabilitated Panel");
			return res.redirect("/rehabedPanels");
		} 
		

		let ID;
		if(req.query.bucket === "reds"){
			ID = new mongoose.Types.ObjectId(foundRehabed.fileID);
		} else if (req.query.bucket === "rehabs") {
			ID = new mongoose.Types.ObjectId(foundRehabed.rehabedFileID);
		}

		const gfsR = new mongoose.mongo.GridFSBucket(connection.db, { bucketName: req.query.bucket });
		gfsR.find({ _id: ID }).toArray((err, file) => {
			if (err || !file[0]) {
				console.log(err)
				req.flash("error", "Error occured while downloading file");
				return res.redirect("/rehabedPanels");
			}
			res.writeHead(200, {
				"Content-Type": file[0].contentType,
				"Content-Disposition": "attachment; filename=" + foundRehabed.reportNumber + req.query.bucket.toUpperCase() + ".pdf",
			});

			const readstream = gfsR.openDownloadStreamByName(file[0].filename);
			readstream.pipe(res);
		});
	});
});

// 5. Edit route - Edit a specific redpanel (Renders a form)
router.get("/sections/:id/rehabedPanels/:rehabedPanel_id/edit", isConnectionOpen, isLoggedIn, isRehabAuthor, function (req, res) {
	// Rehab.findById(req.params.rehabedPanel_id, function (err, foundRehabed) {
	// 	if (err || !foundRehabed) {
	// 		req.flash("error", "Cannot find requested Rehabilitaed Panel")
	// 		return res.redirect("/rehabedPanels")
	// 	} else {
	// 		res.render("rehab/edit", { section_id: req.params.id, rehabedPanel: foundRehabed, title: "TARP-Red" })
	// 	}
	// })
	req.flash("warning", "Cannot edit rehabilitated panel");
	res.redirect("/rehabedPanels");
});

// 6. Update route - Puts the supplied info from edit form into the database
router.put("/sections/:id/redPanels/:redpanel_id", isConnectionOpen, isLoggedIn, isRehabAuthor, function (req, res) {
	// Redpanel.findByIdAndUpdate(req.params.redpanel_id, req.body.redPanel, function (err, updatedRedpanel) {
	// 	if (err || !updatedRedpanel) {
	// 		req.flash("error", "Cannot find requested TARP Red panel")
	// 		return res.redirect("/redPanel")
	// 	}
	// 	 else {
	// 		req.flash("success", "Successfully updated a TARP Red panel")
	// 		return res.redirect("/redPanel/" + req.params.redpanel_id)
	// 	}
	// })
	req.flash("warning", "Cannot Update Rehabilitated Panel");
	res.redirect("/rehabedPanels");
});
// 7. Delete route - Delete particular red panel
router.delete("/sections/:id/rehabedPanels/:rehabedPanel_id", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	Rehab.findById(req.params.rehabedPanel_id, function (err, foundRehabed) {
		if (err || !foundRehabed) {
			req.flash("error", "Oops! Something went wrong or panel is already deleted");
			return res.redirect("/rehabedPanels");
		}
		Rehab.findByIdAndDelete(req.params.rehabedPanel_id, function (err) {
			if (err) {
				req.flash("error", "Error While Deleting Rehabilitated Panel Data");
				return res.redirect("/rehabedPanels");
			}
			const gfsR = new mongoose.mongo.GridFSBucket(connection.db, { bucketName: "reds" });
			const gfsRH = new mongoose.mongo.GridFSBucket(connection.db, { bucketName: "rehabs" });

			gfsR.delete(new mongoose.Types.ObjectId(foundRehabed.fileID), function (err, data) {
				if (err) {
					req.flash("error", "Error while deleting initial recommendation. Inform MRM Department");
					return res.redirect("/rehabedPanels");
				}
				gfsRH.delete(new mongoose.Types.ObjectId(foundRehabed.rehabedFileID), function(err, data){
					if(err){
						req.flash("error", "Error while deleting signed off recommendations. Initial recommendations deleted. Inform MRM Department");
						return res.redirect("/rehabedPanels");
					}
				});
				req.flash("success", "Successfully deleted a rehabilitated panel");
				res.redirect("/rehabedPanels");
			});
		});
	});
});



module.exports = router;