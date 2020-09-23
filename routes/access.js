const express = require("express")
const router  = express.Router()



// REGISTER ROUTES

// Log in routes
router.get("/login", function(req, res){
	res.render("login")
})


// Register routes
router.get("/register", function(req, res){
	res.render("register")
})


module.exports = router;