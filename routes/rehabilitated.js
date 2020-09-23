const express = require("express")
const router  = express.Router()
const Section = require("../models/section")
const Redpanel = require("../models/tarp")
const Rehab   = require("../models/rehab")


// 5. Edit route - (Renders a filed form)
router.get("/sections/:id/rehabs/:rehab_id/now_rehabed", function(req, res){
	Redpanel.findById(req.params.rehab_id, function(err, foundRed){
		if(err){
            console.log(err)
			res.redirect("back")
		} else {
			console.log(foundRed)
			res.render("rehab/sure", {rehabed: foundRed})
		}
	})
})

// 3. Create route - creates a tarp red panel data
router.post("/sections/:id/rehabedPanels", function(req, res){
	// create new redhabilited panel
	Rehab.create(req.body.rehabedPanel, function(err, rehabed){
		if(err){
			console.log(err)
		} else{
			console.log(rehabed)
	
			// res.redirect("/sections/" + req.params.id);
			res.render("rehab/show", {redPanel: rehabed})
		}
	})
})



module.exports = router;