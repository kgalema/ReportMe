const express = require("express")
const passport = require("passport")
const router = express.Router()
const User = require("../models/user")
const async = require("async")
const nodemailer = require("nodemailer")
const crypto = require("crypto")



// +++++++++++++++++++++REGISTER ROUTES++++++++++++++++++++++
router.get("/register", function (req, res) {
	// req.flash("success", "Successfully Registered")
	res.render("access/register", { title: "Register" })
})

router.post("/register", async function (req, res, next) {
	try {
		const { email, username, password } = req.body
		const user = new User({ email, username })
		if (req.body.admin === "secretcode123") {
			user.isAdmin = true
		}
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

// ++++++++++++++++++++++++++Log in routes++++++++++++++++++++++
router.get("/login", function (req, res) {
	// req.flash("success", "Welcome back!")
	res.render("access/login", { title: "Login" })
})
router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), function (req, res) {
	req.flash("success", "Welcome back!");
	const redirectUrl = req.session.returnTo || "/production";
	delete req.session.returnTo;
	res.redirect(redirectUrl)
})

router.get("/logout", function (req, res) {
	req.logout()
	req.flash("success", "Successfully logout!")
	res.redirect("/production")
})

//++++++++++++++++++++++++++++++++forgot password++++++++++++++++++++++++++++++++++
router.get("/forgot", function (req, res) {
	res.render("access/forgot", { title: "Register" })
})


router.post("/forgot", function (req, res, next) {
	async.waterfall([
		function (done) {
			crypto.randomBytes(20, function (err, buf) {
				let token = buf.toString('hex');
				done(err, token);
			});
		},
		function (token, done) {
			User.findOne({ email: req.body.email }, function (err, user) {
				if (!user) {
					req.flash("error", "No account with that email address exists")
					return res.redirect('/forgot')
				}
				user.resetPasswordToken = token
				user.resetPasswordExpires = Date.now() + 3600000

				user.save(function (err) {
					done(err, token, user)
				});
			});
		},
		function (token, user, done) {
			let smtpTransport = nodemailer.createTransport({
				service: "outlook",
				// service: "Gmail",
				auth: {
					user: "kdlreports@outlook.com",
					// user: "ronny.kgalema@gmail.com",
					pass: process.env.GMAILPW
				}
			});
			let mailOptions = {
				to: user.email,
				from: "KDLReports@outlook.com",
				subject: "KDL Report Mine Password Reset",
				text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
					'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
					'http://' + req.headers.host + '/reset/' + token + '\n\n' +
					'If you did not request this, please ignore this email and your password will remain unchanged.\n'
			};
			smtpTransport.sendMail(mailOptions, function (err) {
				console.log("mail sent");
				req.flash("success", `An email has been sent to ${user.email} with further instructions`)
				done(err, "done");
			});
		}
	], function (err) {
		if (err) return next(err);
		res.redirect('/forgot');
	});
});

router.get('/reset/:token', function (req, res) {
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
		if (!user) {
			req.flash('error', 'Password reset token is invalid or has expired.');
			return res.redirect('/forgot');
		}
		res.render('access/reset', { token: req.params.token, title: "Login" });
	});
});

router.post('/reset/:token', function (req, res) {
	async.waterfall([
		function (done) {
			User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
				if (!user) {
					req.flash('error', 'Password reset token is invalid or has expired.');
					return res.redirect('back');
				}
				if (req.body.password === req.body.confirm) {
					user.setPassword(req.body.password, function (err) {
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;

						user.save(function (err) {
							req.logIn(user, function (err) {
								done(err, user);
							});
						});
					})
				} else {
					req.flash("error", "Passwords do not match.");
					return res.redirect('back');
				}
			});
		},
		function (user, done) {
			let smtpTransport = nodemailer.createTransport({
				// service: 'Gmail',
				service: 'outlook',
				auth: {
					user: 'kdlreports@outlook',
					// user: 'ronny.kgalema@gmail.com',
					pass: process.env.GMAILPW
				}
			});
			let mailOptions = {
				to: user.email,
				from: 'KDLReports@outlook.com',
				subject: 'Your password has been changed',
				text: 'Hello,\n\n' +
					'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
			};
			smtpTransport.sendMail(mailOptions, function (err) {
				req.flash('success', 'Your password has been successfully changed.');
				done(err);
			});
		}
	], function (err) {
		res.redirect('/production');
	});
});

module.exports = router;