const express = require("express")
const router  = express.Router()



// REGISTER ROUTES

// LOG IN ROUTES
router.get("/login", function(req, res){
	res.render("login")
})

router.get("/register", function(req, res){
	res.render("register")
})


module.exports = router;