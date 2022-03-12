const express = require("express")
const router = express.Router()
const ROM = require("../models/ROM")


const moment = require("moment")
const { isLoggedIn, isConnectionOpen } = require("../middleware")

// 1. Index Route
router.get("/rom", isConnectionOpen, function (req, res, next) {
	ROM.find({}, function (err, roms) {
		if (err) {
			return res.next(err);
		}
		res.render("rom/index", { roms: roms, title: "sections" });
	});
});

// 2. New Route - for rendering a new ROM form
router.get("/rom/new", isLoggedIn, function (req, res) {
    res.render("ROM/new", { title: "production-report" })
})


// 3. Create Route - post captured data into database
router.post("/rom", isConnectionOpen, isLoggedIn, function (req, res) {
	ROM.create(req.body.rom, function (err, createdROM) {
		if (err) {
			// console.log(err)
			req.flash("error", "Looks like you are trying to create duplicate report");
			return res.redirect("back");
		} else {
			console.log(req.user);
			createdROM.author.id = req.user._id;
			createdROM.save(function (err, savedCreatedROM) {
				if (err) {
					console.log(err + "Error occured while linking user and C1 Entry");
					req.flash("error", "Error occured while linking user and C1 Entry");
					return res.redirect("back");
				}
				req.flash("success", "Successfully Added C1 Entry");
				res.redirect("/rom");
			});
		}
	});
});



// 4. Show Route - Show specific captured ROM entry with unique id
router.get("/rom/:id", isConnectionOpen, function (req, res) {
	ROM.findById(req.params.id, function (err, foundROM) {
		if (err || !foundROM) {
			req.flash("error", "Something went wrong while fetching ROM");
			return res.redirect("back");
		} else {
			res.render("ROM/show", { foundROM: foundROM, title: "sections" });
		}
	});
});

// 5. Edit Route - Renders a form for editting
router.get("/rom/:id/edit", isConnectionOpen, isLoggedIn, function (req, res) {
	ROM.findById(req.params.id, function (err, editROM) {
		if (err || !editROM) {
			req.flash("error, Something went wrong while fetching ROM");
			return res.redirect("back");
		}
		res.render("ROM/edit", { editROM: editROM, title: "production-report" });
	});
});



// 6. Updated Route - Posts the updated info and overrides what's in the databse
router.put("/rom/:id", isConnectionOpen, isLoggedIn, function (req, res) {
	console.log(req.params);
	ROM.findByIdAndUpdate(req.params.id, req.body.rom, function (err, updatedROM) {
		if (err || !updatedROM) {
			console.log(err);
			req.flash("error", "Something went wrong with the database");
			return res.redirect("back");
		} else {
			// console.log(updatedProduction)
			req.flash("success", "Successfully Updated Production Report");
			res.redirect("/rom");
		}
	});
});
// 7. Delete Route - For deleting one specific ROM captured
router.delete("/rom/:id", isConnectionOpen, isLoggedIn, function (req, res) {
	ROM.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			req.flash("error", "Something went wrong while deleting");
			return res.redirect("back");
		} else {
			req.flash("success", "Successfully Deleted Production Report");
			res.redirect("/rom");
		}
	});
});


module.exports = router;
