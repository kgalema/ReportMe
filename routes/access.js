const express = require("express")
const passport = require("passport")
const router = express.Router()
const User = require("../models/user")



// REGISTER ROUTES
router.get("/register", function (req, res) {
	// req.flash("success", "Successfully Registered")
	res.render("access/register", { title: "Register" })
})

router.post("/register", async function (req, res, next) {
	try {
		const { email, username, password } = req.body
		const user = new User({ email, username })
		const registeredUser = await User.register(user, password)
		req.login(registeredUser, err => {
			if (err) return next(err)
			req.flash("success", "Welcome to ReportMine app")
			res.redirect("/production")
		})
	} catch (e) {
		req.flash("error", e.message)
		res.redirect("register")

	}

	// req.flash("success", "Successfully Registered")
	// res.render("access/register", { title: "Register" })
})

// Log in routes
router.get("/login", function (req, res) {
	// req.flash("success", "Welcome back!")
	res.render("access/login", { title: "Login" })
})
router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), function (req, res) {
	req.flash("success", "Welcome back!");
	const redirectUrl = req.session.returnTo || "/";
	delete req.session.returnTo;
	res.redirect(redirectUrl)
})

router.get("/logout", function (req, res) {
	req.logout()
	req.flash("success", "Successfully logout!")
	res.redirect("/production")
})


module.exports = router;