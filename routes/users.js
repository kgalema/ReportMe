const express = require("express");
const router = express.Router();
const User = require("../models/user");
const RequestAccess = require("../models/requestAccess");
const { isLoggedIn, isAdmin, isConnectionOpen } = require("../middleware");
const codeAdmin = process.env.secretCode

// 1. @Index route: Shows you all users/employess***
router.get("/users", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	User.find({}, function (err, allUsers) {
		if (err || !allUsers) {
			req.flash("error", "Error occured while fetching all users");
			return res.redirect("back");
		}
		RequestAccess.find({}, function(err, requests){
			if(err || !requests){
				req.flash("error", "Error occure while getting users")
				return res.redirect("back")
			}
			res.render("users/index", { requests, allUsers: allUsers, title: "users" });
		})
	});
});

// 2. @New route: Renders register form***
router.get("/users/new", isConnectionOpen, function (req, res) {
	res.render("users/new", { title: "users" });
});

// 3. @Create route - post a new section into the database then redirect elsewhere
router.post("/users", isConnectionOpen, async function (req, res, next) {
	try {
		const { preferredName, username, password, occupation, department, isAdmin, _id } = req.body;

		const user = new User({ preferredName, username, occupation, department, isAdmin });

		const registeredUser = await User.register(user, password);

		// On sucessfull registering, delete new user requesting
		const removed = await RequestAccess.findByIdAndRemove(_id);

		req.login(registeredUser, (err) => {
			if (err) return next(err);
			req.flash("success", "You are successfully logged in");
			res.redirect("/production");
		});
	} catch (e) {
		req.flash("error", e.message);
		res.redirect("/users/new");
	}
});

// 4. @Show route - shows/get info about one specific user
router.get("/user/:id", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	User.findById(req.params.id, function (err, foundUser) {
		if (err || !foundUser) {
			req.flash("error", "Invalid user");
			return res.redirect("/users");
		}
		res.render("users/show", { foundUser: foundUser, title: "users" });
	});
});

// 5. @Edit route - renders edit form to edit one particular user
router.get("/user/:id/edit", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	User.findById(req.params.id, function (err, foundUser) {
		if (err) {
			req.flash("error", "Invalid user");
			return res.redirect("/users");
		} else {
			res.render("users/edit", { foundUser: foundUser, title: "users" });
		}
	});
});

// 6. @Update route - Puts edited info about one particular user in the database
router.put("/user/:id", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	if (req.body.user.admin === codeAdmin) {
		req.body.user.isAdmin = true;
	}

	User.findByIdAndUpdate(req.params.id, req.body.user, function (err, updatedUser) {
		if (err || !updatedUser) {
			req.flash("error", "Error occured while updating user");
			return res.redirect("back");
		}
		req.flash("success", "Successfully updated user");
		res.redirect("/user/" + req.params.id);
	});
});

// 7. @Destroy route - Deletes a particular section 
router.delete("/user/:id", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	User.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			req.flash("error", "Error occured while deleting user");
			return res.redirect("back");
		} else {
			req.flash("success", "Successfully deleted user");
			res.redirect("/users");
		}
	});
});




module.exports = router;