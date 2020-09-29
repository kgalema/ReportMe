const express = require("express")
const Rehab = require("../models/rehab")
const router  = express.Router()
const Section = require("../models/section")
const Redpanel = require("../models/tarp")

const multer	= require("multer");



// ======Saving files on my local machine=======

const storage =   multer.diskStorage({
	destination: function (req, file, callback) {
	  callback(null, './public/uploads');
	},
	filename: function (req, file, callback) {
		console.log(file);
	  callback(null, Date.now() +"-"+ file.originalname);
	}
  });
  
  const upload = multer({ storage : storage});

// ======Upload on cloudinary===================
// const storage = multer.diskStorage({
// 	filename: function(req, file, callback) {
// 	  callback(null, Date.now() + file.originalname);
// 	}
//   });

// ++++++++++image filter++++++
//   var imageFilter = function (req, file, cb) {
// 	  // accept image files only
// 	  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
// 		  return cb(new Error('Only image files are allowed!'), false);
// 	  }
// 	  cb(null, true);
//   };

//   const upload = multer({ storage: storage})
  
  const cloudinary = require('cloudinary');
  cloudinary.config({ 
	cloud_name: 'dojtbpbwc', 
	api_key: process.env.CLOUDINARY_API_KEY, 
	api_secret: process.env.CLOUDINARY_API_SECRET
  });




//======================
//TARP Red panels routes
//======================

// 1. Index routes -renders a list for all red panels
router.get("/redPanel", function(req, res){
	// res.render("redPanels/index")
	Redpanel.find({}, function(err, redpanels){
		if(err){
			console.log(err);
		} else {
			res.render("redPanels/index", {redpanels: redpanels})
		}
	})
})

// 2. New Route - renders a form for red panels
router.get("/sections/:id/redPanel/new", function(req, res){
	Section.findById(req.params.id, function(err, foundSection){
		if(err){
			console.log(err);
		} else {
			res.render("redPanels/new", {section: foundSection})
		}
	})
})

// 3. Create route - creates a tarp red panel data
router.post("/sections/:id/redPanels", upload.single("issuedReport"), function(req, res){
	cloudinary.v2.uploader.upload(req.file.path, function(err, result){
		req.body.redPanel.issuedReport = result.secure_url;

		// lookup section using ID
		Section.findById(req.params.id, function(err, section){
			if(err){
				console.log(err)
				res.redirect("/sections")
			} else {
				// create new redPanel
				Redpanel.create(req.body.redPanel, function(err, redpanel){
					if(err){
						console.log(err)
					} else{
						console.log(req.body.redPanel)
						//add section and section id to repanel
						redpanel.section.id = section._id
						redpanel.section.name = section.name
						//save redpanel
						redpanel.save()
						section.redPanels.push(redpanel)
						section.save()
						// connsole.log(section)
						//redirect to sections show page
						res.redirect("/sections/" + section._id)
					}
				})
			}
		})
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
router.get("/redPanel/:id", function(req, res){
	// res.render("redPanels/show")
	Redpanel.findById(req.params.id, function(err, foundRedPanel){
		if(err || !foundRedPanel){
			console.log(err)
			res.redirect("back")
		} else {
			res.render("redPanels/show", {redPanel: foundRedPanel})
		}
	});
})

// 5. Edit route - Edit a specific redpanel (Renders a form)
router.get("/sections/:id/redPanels/:redpanel_id/edit", function(req, res){
	Redpanel.findById(req.params.redpanel_id, function(err, foundRed){
		if(err){
			res.redirect("back")
		} else {
			res.render("redPanels/edit", {section_id: req.params.id, redpanel: foundRed})
		}
	})
})

// 6. Update route - Puts the supplied info from edit form into the database
router.put("/sections/:id/redPanels/:redpanel_id", function(req, res){
	Redpanel.findByIdAndUpdate(req.params.redpanel_id, req.body.redPanel, function(err, updatedRedpanel){
		if(err){
			res.redirect("back")
		} else {
			res.redirect("/redPanel/" + req.params.redpanel_id)
		}
	})
})
// 7. Delete route - Delete particular red panel
router.delete("/sections/:id/redPanels/:redpanel_id", function(req, res){
	Redpanel.findByIdAndRemove(req.params.redpanel_id, function(err){
		if(err){
			res.redirect("back")
		} else {
			console.log(req.params.redpanel_id)
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