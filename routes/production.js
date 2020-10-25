const express  = require("express")
const router   = express.Router()
const Section  = require("../models/section")
const Blast	   = require("../models/blast")
const Clean    = require("../models/clean")
const Support  = require("../models/support")
const Production =require("../models/production")




//===========================
// Production Reports Routes
//===========================

// 1. Landing Route
router.get("/", function(req, res){
	res.render("welcomePage")
})

// 1. Index route === Shows you all captured reports
router.get("/production", function(req, res){
	Section.find({}, function(err, allSections){
		if(err){
			console.log(err);
		} else {
			res.render("production/index", {sections : allSections})
		}
	})
})

// 2. New route - renders production report form
router.get("/sections/:id/production/new", function(req, res){
	Section.findById(req.params.id, function(err, foundSection){
		if(err){
			console.log(err);
		} else {
			res.render("production/new", {section: foundSection});
		}
	})
})

// // 2.1 New route - renders new form for adding cleaned panels
// router.get("/sections/:id/production/newClean", function(req, res){
// 	Section.findById(req.params.id, function(err, foundSection){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			res.render("production/newClean", {section: foundSection})
// 		}
// 	})
// })

// // 2.3 New route - renders new form for adding supported panels
// router.get("/sections/:id/production/newSupport", function(req, res){
// 	Section.findById(req.params.id, function(err, foundSection){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			// console.log(foundSection)
// 			res.render("production/newSupport", {section: foundSection})
// 		}
// 	})
// })


// 3. Create route - post the information into the database
router.post("/sections/:id/production", function(req, res){
	Section.findById(req.params.id, function(err, section){
		if(err){
			console.log(err);
			res.redirect("/back");
		} else {
			// console.log(req.body.production)
			Production.create(req.body.production, function(err, report){
				if(err){
					console.log(err)
				} else{
					// console.log(report)
					report.section.id = section._id;
					report.section.name = section.name;
					// console.log(report);
					report.save();
					section.production.push(report);
					section.save();
					console.log(report)
					res.render("production/showProduction", {reported:report});	
				}
			})
		}
	})
})



// 3.2 Create route - cleaned panels

// router.post("/sections/:id/production/clean", function(req, res){
// 	Section.findById(req.params.id, function(err, section){
// 		if(err){
// 			console.log(err)
// 			res.redirect("/production")
// 		} else {
// 			Clean.create(req.body.clean, function(err, cleaned){
// 				if(err){
// 					console.log(err)
// 				} else{
// 					console.log(cleaned)
// 					cleaned.forEach(function(b){
// 						b.section.id = section._id;
// 						b.section.name = section.name;
// 						b.shift = cleaned[0].shift;
// 					})
// 					cleaned.forEach(function(e){
// 						e.save()
// 					})

// 					console.log(cleaned)
					
					
// 					cleaned.forEach(function(e){
// 						section.cleanedPanels.push(e)
// 					})
// 					section.save()
// 					res.render("production/newSupport", {section:section})
// 				}
// 			})
// 		}
// 	})
// })

// 3.3 Create route - supported panels

// router.post("/sections/:id/production/support", function(req, res){
// 	Section.findById(req.params.id, function(err, section){
// 		if(err){
// 			console.log(err)
// 			res.redirect("/production")
// 		} else {
// 			Support.create(req.body.support, function(err, supported){
// 				if(err){
// 					console.log(err)
// 				} else{
// 					console.log(supported)
// 					supported.forEach(function(b){
// 						b.section.id = section._id;
// 						b.section.name = section.name;
// 						b.shift = supported[0].shift;
// 					})
// 					supported.forEach(function(e){
// 						e.save()
// 					})

// 					console.log(supported)
					
// 					supported.forEach(function(e){
// 						section.supportedPanels.push(e)
// 					})
// 					section.save()
// 					res.redirect("/production")
// 				}
// 			})
// 		}
// 	})
	
// })


// 4. Show route - shows info about 1 specific reported section within a new form
router.get("/sections/:id/production/show", function(req, res){
	Section.findById(req.params.id).populate("production").exec(function(err, foundSection){
		if(err){
			console.log(err)
		} else {
			console.log(foundSection.production)
			res.render("production/showProduction", {reported: foundSection})
		}
	});
})

// 5. Edit - shows an edit production edit form
router.get("/sections/:id/production/:production_id/edit", function(req, res){
	Production.findById(req.params.production_id, function(err, foundProduction){
		if(err){
			res.redirect("back")
		} else {
			res.render("production/edit", {production: foundProduction})
		}
	})
})
// 6. Update - takes info from edit form and PUTs it into existing data in the database

// 7. Destroy - delete one specific production report
router.delete("/sections/:id/production/:id", function(req, res){

})


module.exports = router;