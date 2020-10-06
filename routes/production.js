const express  = require("express")
const router   = express.Router()
const Section  = require("../models/section")
const Blast	   = require("../models/blast")
const Clean    = require("../models/clean")
const Support  = require("../models/support")




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

// 2.0 New route - renders new form adding report
router.get("/sections/:id/production/new", function(req, res){
	Section.findById(req.params.id, function(err, foundSection){
		if(err){
			console.log(err);
		} else {
			// console.log(foundSection)
			res.render("production/newBlast", {section: foundSection})
		}
	})
})

// 2.1 New route - renders new form for adding cleaned panels
router.get("/sections/:id/production/newClean", function(req, res){
	Section.findById(req.params.id, function(err, foundSection){
		if(err){
			console.log(err);
		} else {
			// console.log(foundSection)
			res.render("production/newClean", {section: foundSection})
		}
	})
})

// 2.3 New route - renders new form for adding supported panels
router.get("/sections/:id/production/newSupport", function(req, res){
	Section.findById(req.params.id, function(err, foundSection){
		if(err){
			console.log(err);
		} else {
			// console.log(foundSection)
			res.render("production/newSupport", {section: foundSection})
		}
	})
})


// 3.1 Create route - blasted panels
router.post("/sections/:id/production", function(req, res){
	// req.body.blog.body = req.sanitize(req.body.blog.body)
	Section.findById(req.params.id, function(err, section){
		if(err){
			console.log(err)
			res.redirect("/production")
		} else {
			// create new blasted panel
			Blast.create(req.body.blast, function(err, blasted){
				if(err){
					console.log(err)
				} else{
					// console.log(blasted[0].shift)
					//add section name and id to blasted panel
					// console.log(blasted)
					blasted.forEach(function(b){
						b.section.id = section._id;
						b.section.name = section.name;
						b.shift = blasted[0].shift;
					})
					console.log(blasted)

					//save an array of blasted panels
					blasted.forEach(function(e){
						e.save()
					})
					
					
					// console.log(blasted)

					blasted.forEach(function(e){
						section.blastedPanels.push(e)
					})
					// section.blastedPanels.push(blasted)
					// connect new blasted panel to section
					section.save()
					// console.log(section)
					//redirect to sections show page
					res.render("production/newClean", {section:section})
				}
			})
		}
	})
})



// 3.2 Create route - cleaned panels
router.post("/sections/:id/production/clean", function(req, res){
	// req.body.blog.body = req.sanitize(req.body.blog.body)
	Section.findById(req.params.id, function(err, section){
		if(err){
			console.log(err)
			res.redirect("/production")
		} else {
			// create new cleaned panel
			Clean.create(req.body.clean, function(err, cleaned){
				if(err){
					console.log(err)
				} else{
					console.log(cleaned)
					//add section name and id to cleaned panel
					cleaned.forEach(function(b){
						b.section.id = section._id;
						b.section.name = section.name;
						b.shift = cleaned[0].shift;
					})

					//save an array of cleaned panels
					cleaned.forEach(function(e){
						e.save()
					})

					console.log(cleaned)
					
					//associated cleaned panels with a section
					cleaned.forEach(function(e){
						section.cleanedPanels.push(e)
					})
					// save section
					section.save()
					
					//redirect to next
					res.render("production/newSupport", {section:section})
				}
			})
		}
	})
	
})

// 3.3 Create route - supported panels
router.post("/sections/:id/production/support", function(req, res){
	// req.body.blog.body = req.sanitize(req.body.blog.body)
	Section.findById(req.params.id, function(err, section){
		if(err){
			console.log(err)
			res.redirect("/production")
		} else {
			// create new supported panel
			Support.create(req.body.support, function(err, supported){
				if(err){
					console.log(err)
				} else{
					console.log(supported)
					//add section name and id to supported panel
					supported.forEach(function(b){
						b.section.id = section._id;
						b.section.name = section.name;
						b.shift = supported[0].shift;
					})

					//save an array of supported panels
					supported.forEach(function(e){
						e.save()
					})

					console.log(supported)
					
					//associated supported panels with a section
					supported.forEach(function(e){
						section.supportedPanels.push(e)
					})
					// save section
					section.save()
					
					//redirect to sections show page
					res.redirect("/production")
				}
			})
		}
	})
	
})


// 4. Show route - shows info about 1 specific reported section within a new form
router.get("/sections/:id/production/show", function(req, res){
	Section.findById(req.params.id).populate("blastedPanels").exec(function(err, foundSection){
		if(err){
			console.log(err)
		} else {
	// then redirect to the index route
			res.render("production/showProduction", {reported: foundSection})
		}
	});
})

// 5.1 Edit - shows an edit form form
router.get("/sections/:id/production/:redpanel_id/edit", function(req, res){
	Redpanel.findById(req.params.redpanel_id, function(err, foundRed){
		if(err){
			res.redirect("back")
		} else {
			res.render("redPanels/edit", {section_id: req.params.id, redpanel: foundRed})
		}
	})
})
// 6. Update - takes info from edit form and PUTs it into existing data

// 7. Destroy - delete one specific production panel
router.delete("/sections/:id/production/:id", function(req, res){

})


module.exports = router;