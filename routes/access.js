const express = require("express")
const passport = require("passport")
const router = express.Router()
const User = require("../models/user")
const RequestAccess = require("../models/requestAccess")
const crypto = require("crypto")
const { isConnectionOpen } = require("../middleware")


//@log in - get the log in form
router.get("/login", function (req, res) {
	res.render("access/login", { title: "Login" })
})

//@authenticate user with submitted form data
router.post("/login", isConnectionOpen, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), function (req, res) {
	const redirectUrl = req.session.returnTo || "/production";
	delete req.session.returnTo;
	req.flash("success", "Welcome back!");
	res.redirect(redirectUrl)
})

//@Log out route
router.get("/logout", function (req, res) {
	req.logout()
	req.flash("success", "Successfully logged out!")
	res.redirect("/production")
})

//@Forgot password routes

//@Forgot password - get the form
router.get("/forgot", function (req, res) {
	res.render("access/forgot", { title: "Register" })
})

//@Submit email address of user and send an email to the user
router.post("/forgot", function (req, res, next) {
	crypto.randomBytes(20, function (err, buf) {
		let token = buf.toString("hex");

		User.findOne({ username: req.body.username }, function (err, user) {
      		if (err || !user) {
        		req.flash("error", "No account with that email address exists");
        		return res.redirect("/forgot");
      		}
      		user.resetPasswordToken = token;
      		user.resetPasswordExpires = Date.now() + 3600000;

      		user.save(function (err) {
					if(err){
						req.flash("error", "Error occured while saving user. Contact admin");
						return res.redirect("/forgot");
					}

					const resetUrl = req.protocol +"://" + req.headers.host + "/reset/" + token;
					res.render("access/forgot", {resetUrl, name: user.preferredName, title: "users" });
      		});
    	});
	});
});


//@Reset the password - get form
router.get('/reset/:token', function (req, res) {
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
		if (!user) {
			req.flash('error', 'Password reset token is invalid or has expired.');
			return res.redirect('/forgot');
		}
		res.render('access/reset', { token: req.params.token, name: user.preferredName, title: "Login" });
	});
});

//@Post new password and update exisiting
router.post('/reset/:token', function (req, res) {
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
    	if (err || !user) {
    		req.flash("error", "Password reset token is invalid. Contact admin.");
    		return res.redirect("/forgot");
    	}
    	if (req.body.password === req.body.confirm) {
    		user.setPassword(req.body.password, function (err) {
				if(err){
					req.flash("error", "Error occured while setting new password. Contact admin");
					return res.redirect("/login")
				}
        		user.resetPasswordToken = undefined;
        		user.resetPasswordExpires = undefined;

        		user.save(function (err) {
					if(err){
						req.flash("error", "Error while updating user. Contact admin")
						return res.redirect("/forgot")
					}
        			req.logIn(user, function (err) {
						if(err){
							req.flash("error", "Error occured while logging you in. Contact admin")
							return res.redirect("/login")
						}
						req.flash("success", "Your password was successfully updated.");
						res.redirect("/production");
            		});
          		});
        	});
    	} else {
        	req.flash("error", "Passwords do not match.");
        	return res.redirect("back");
    	};
    });
});


// User requesting access routes
router.get("/users/newRequest", isConnectionOpen, function (req, res) {
	User.find({}, function(err, users){
		if(err || !users){
			req.flash("error", "Error occured while checking existing users");
			return res.redirect("/production");
		}
		res.render("access/new", { users, title: "Register" });
	})
});


router.post("/users/newRequest", isConnectionOpen, function (req, res) {
	RequestAccess.create(req.body, function(err, newRequest){
		if(err || !newRequest){
			req.flash("error", "Error occured while requesting access")
			return res.redirect("/users/newRequest");
		}
		req.flash("success", "Request for access was submitted. You will be responded shortly")
		return res.redirect("/production");
	});
});


router.get("/users/newRequest/:_id", isConnectionOpen, function (req, res) {
	RequestAccess.findById(req.params._id, function(err, foundRequest){
		if(err || !foundRequest){
			req.flash("error", "Error occured while retrieving user");
			res.return("/users");
		}
		res.render("users/new", { foundRequest, title: "users" });
	});
});

module.exports = router;