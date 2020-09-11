const express = require("express")
const router  = express.Router()
const Section = require("../models/section")
const Redpanel = require("../models/tarp")




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
router.post("/sections/:id/redPanels", function(req, res){
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
					//add section and section id to repanel
					redpanel.section.id = section._id
					redpanel.section.name = section.name
					//save redpanel
					redpanel.save()
					section.redPanels.push(redpanel)
					section.save()
					// console.log(section)
					//redirect to sections show page
					res.redirect("/sections/" + section._id)
				}
			})
		}
	})
	
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
			res.redirect("/redPanel")
		}
	})
})


module.exports = router;