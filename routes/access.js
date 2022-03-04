const express = require("express")
const passport = require("passport")
const router = express.Router()
const User = require("../models/user")
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const { isConnectionOpen } = require("../middleware")


//@Log in routes

//@log in - get the log in form
router.get("/login", function (req, res) {
	res.render("access/login", { title: "Login" })
})

//@authenticate user with submitted form data
router.post("/login", isConnectionOpen, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), function (req, res) {
	console.log(req.session.returnTo)
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

		User.findOne({ email: req.body.email }, function (err, user) {
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
					let smtpTransport = nodemailer.createTransport({
            			service: "outlook",
            			auth: {
              				user: "kdlreports@outlook.com",
              				pass: process.env.GMAILPW,
            			}
          			});

					let mailOptions = {
            			to: user.email,
            			from: "KDL Reports <KDLReports@outlook.com>",
            			subject: "KDL Reports Password Reset",
            			text:
             		 	"You are receiving this email because you have requested to reset the password for your account.\n\n" +
              			"Please click the link below or copy and paste it into your browser to complete the process:\n\n" +
              			"http://" + req.headers.host + "/reset/" + token + "\n\n" +
              			"If you did not request password reset, please ignore this email and your password will remain unchanged.\n\n" +
						"Regards\n" +
						"KDL Reports Admin"
          			};

					smtpTransport.sendMail(mailOptions, function (err, info) {
						if(err){
							console.log(err);
							req.flash("error", "Error occured while sending you a mail. Contact admin");
							return res.redirect("/forgot");
						}
            			console.log("mail sent");
            			req.flash("success", `An email has been sent to ${user.email} with further instructions`);
						res.redirect("/forgot");
			        });
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
		res.render('access/reset', { token: req.params.token, title: "Login" });
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
						let smtpTransport = nodemailer.createTransport({
							service: "outlook",
							host: "smtp.live.com",
							auth: {
								user: "kdlreports@outlook.com",
								pass: process.env.GMAILPW,
							},
						});

						let mailOptions = {
							to: user.email,
							from: "KDL Reports <KDLReports@outlook.com>",
							subject: "Your password was updated",
							text:
								"Hello,\n\n" +
								"This is a confirmation that the password for your account " + user.email + " was updated.\n\n" +
								"Regards\n" +
								"KDL Reports Admin"
						};

						smtpTransport.sendMail(mailOptions, function (err) {
							if(err){
								return
							}
            				req.flash("success", "Your password was successfully updated.");
            				res.redirect("/production");
          				});
            		});
          		});
        	});

    	} else {
        	req.flash("error", "Passwords do not match.");
        	return res.redirect("back");
    	};
    });
});

module.exports = router;