const express = require("express")
const fs = require("fs")
const router = express.Router()
const path = require("path")
const moment = require("moment")
const Section = require("../models/section")
const Redpanel = require("../models/tarp")
const { isLoggedIn, isAuthor } = require("../middleware")

const multer = require("multer")
// const toUpload = multer({ dest: "uploads/" })



// ======Saving files on my local machine=======

const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, 'uploads/');
	},
	filename: function (req, file, callback) {
		// console.log(file);
		// callback(null, moment(Date.now()).format('YYYY-MM-DD') + "-" + file.originalname);
		callback(null, Date.now() + "-" + file.originalname);
	}
});

// const upload = multer({ storage: storage });

// ++++++++++file filter++++++
const fileFilter = function (req, file, cb) {
	// accept pdf files only
	if (file.mimetype === "application/pdf") {
		return cb(null, true)
		// return cb(new Error('Only image files are allowed!'), false);
	}
	return cb(new Error("Only pdfs allowed"), false);
};

const upload = multer({ storage: storage, fileFilter: fileFilter })

// const cloudinary = require('cloudinary');
// cloudinary.config({
// 	cloud_name: 'dojtbpbwc',
// 	api_key: process.env.CLOUDINARY_API_KEY,
// 	api_secret: process.env.CLOUDINARY_API_SECRET
// });




//======================
//TARP Red panels routes
//======================

// 1. Index routes -renders a list for all red panels
router.get("/redPanel", function (req, res) {
	console.log(req.url)
	Redpanel.find({}, function (err, redpanels) {
		if (err) {
			console.log(err);
			return res.redirect("back")
		} else {
			res.render("redPanels/index", { redpanels: redpanels, title: "TARP-Red" })
		}
	})
})

// 2. New Route - renders a form for red panels
router.get("/sections/:id/redPanel/new", isLoggedIn, function (req, res) {
	Section.findById(req.params.id, function (err, foundSection) {
		if (err) {
			console.log(err);
			return res.redirect("back")
		} else {
			res.render("redPanels/new", { section: foundSection, title: "TARP-Red" })
		}
	})
})

// 3. Create route - creates a tarp red panel data
router.post("/sections/:id/redPanels", isLoggedIn, upload.single("issuedReport"), function (req, res) {
	Section.findById(req.params.id, function (err, section) {
		if (err) {
			console.log(err)
			return res.redirect("/sections")
		} else {
			console.log(req.file.path)
			// const obj = {
			// 	data: fs.readFileSync(path.join(__dirname + "/uploads/" + req.file.filename)),
			// 	contentType: "application/pdf"
			// }
			// req.body.redPanel.issuedReport = obj
			req.body.redPanel.issuedReport = req.file.path
			// console.log(obj)
			Redpanel.create(req.body.redPanel, function (err, redpanel) {
				if (err) {
					console.log(err)
					return res.redirect("back")
				} else {
					console.log(req.body.redPanel)
					//add section and section id to repanel
					redpanel.section.id = section._id
					redpanel.section.name = section.name
					redpanel.author = req.user._id
					//save redpanel
					redpanel.save(function () {
						console.log(redpanel)
						req.flash("success", "Successfully added TARP Red panel")
						res.redirect("/redPanel")
					})
					// section.redPanels.push(redpanel)
					// section.save()
					// req.flash("success", "Successfully added TARP Red panel")
					// res.redirect("/sections/" + req.params.id)
					// res.redirect("/redPanel")
				}
			})
		}
		// })
	})
	// lookup section using ID
	// Section.findById(req.params.id, function(err, section){
	// 	if(err){
	// 		console.log(err)
	// 		res.redirect("/sections")
	// 	} else {
	// 		// create new redPanel
	// 		Redpanel.create(req.body.redPanel, function(err, redpanel){
	// 			if(err){
	// 				console.log(err)
	// 			} else{
	// 				console.log(req.body.redPanel)
	// 				//add section and section id to repanel
	// 				redpanel.section.id = section._id
	// 				redpanel.section.name = section.name
	// 				//save redpanel
	// 				redpanel.save()
	// 				section.redPanels.push(redpanel)
	// 				section.save()
	// 				// connsole.log(section)
	// 				//redirect to sections show page
	// 				res.redirect("/sections/" + section._id)
	// 			}
	// 		})
	// 	}
	// })
})

// 4. Show route - shows info about one specific redpanel
router.get("/redPanel/:id", function (req, res) {
	// res.render("redPanels/show")
	Redpanel.findById(req.params.id, function (err, foundRedPanel) {
		if (err || !foundRedPanel) {
			// console.log(err)
			req.flash("error", "Cannot find requested TARP Red panel")
			return res.redirect("/redPanel")
		}
		res.render("redPanels/show", { redPanel: foundRedPanel, title: "TARP-Red" })
	});
})

// 4.1 Downloading the stored file
router.get("/sections/:id/redPanels/:redpanel_id/download", function (req, res) {
	Redpanel.findById(req.params.redpanel_id, function (err, foundRed) {
		if (err || !foundRed) {
			req.flash("error", "Cannot find requested TARP Red panel")
			return res.redirect("/redPanel")
		} else {
			// let path = __dirname+'/public/' + foundRed
			// res.send(foundRed.issuedReport)
			res.download(foundRed.issuedReport)
			// res.render("redPanels/edit", { section_id: req.params.id, redpanel: foundRed })
		}
	})
})

// 5. Edit route - Edit a specific redpanel (Renders a form)
router.get("/sections/:id/redPanels/:redpanel_id/edit", isLoggedIn, isAuthor, function (req, res) {
	Redpanel.findById(req.params.redpanel_id, function (err, foundRed) {
		if (err || !foundRed) {
			req.flash("error", "Cannot find requested TARP Red panel")
			return res.redirect("/redPanel")
		} else {
			res.render("redPanels/edit", { section_id: req.params.id, redpanel: foundRed, title: "TARP-Red" })
		}
	})
})

// 6. Update route - Puts the supplied info from edit form into the database
router.put("/sections/:id/redPanels/:redpanel_id", isLoggedIn, isAuthor, upload.single("issuedReport"), function (req, res) {
	if (req.file) {
		req.body.redPanel.issuedReport = req.file
	}
	Redpanel.findByIdAndUpdate(req.params.redpanel_id, req.body.redPanel, function (err, updatedRedpanel) {
		if (err || !updatedRedpanel) {
			req.flash("error", "Cannot find requested TARP Red panel")
			return res.redirect("/redPanel")
		} else {
			req.flash("success", "Successfully updated a TARP Red panel")
			res.redirect("/redPanel/" + req.params.redpanel_id)
		}
	})
})
// 7. Delete route - Delete particular red panel
router.delete("/sections/:id/redPanels/:redpanel_id", isLoggedIn, isAuthor, function (req, res) {
	Redpanel.findByIdAndRemove(req.params.redpanel_id, function (err) {
		if (err) {
			req.flash("error", "Oops! Something went wrong :(")
			return res.redirect("/redPanel")
		} else {
			// console.log(req.params.redpanel_id)
			req.flash("success", "Successfully deleted a TARP red panel")
			res.redirect("/redPanel")
		}
	})
	// Redpanel.findById(req.params.redpanel_id, function(err, found){
	// 	if(err){
	// 		res.redirect("back")
	// 	} else {
	// 		console.log(found);
	// 		Rehab.create(found, function(err, rehabed){
	// 			if(err){
	// 				console.log(err);
	// 				res.redirect("back")
	// 			} else {
	// 				res.redirect("/redPanel")
	// 			}
	// 		} )
	// 	}
	// })
})


module.exports = router;