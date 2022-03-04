const express = require("express");
const router = express.Router();
const Shift = require("../models/shift");
const { isLoggedIn, isAdmin, isConnectionOpen } = require("../middleware");

// 1. Index route -list all shift names
router.get("/shifts", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
      Shift.find({}, function(err, shifts){
            if(!err && shifts){
                  return res.render("shifts/index", {shifts, title: "shifts"})
            }
            req.flash("error", "Error occured while fetching shift classes")
            res.redirect("back");
      })
});

// 2. New route - renders a form for creating new shift
router.get("/shifts/new", isConnectionOpen, isLoggedIn, isAdmin, function (req, res) {
	res.render("shifts/new", { title: "shifts" });
});

// 3. Create route - post a new shift class into the database then redirect to index
router.post("/shifts", isLoggedIn, isAdmin, function (req, res) {
      // Making a date
      const startTime = new Date();
      const timeStart = req.body.shift.start.split(":");
	const hoursStart = Number(timeStart[0]);
	const minutesStart = Number(timeStart[1]);
      startTime.setHours(hoursStart);
      startTime.setMinutes(minutesStart);
      startTime.setSeconds(0);
      startTime.setMilliseconds(0);

      // End time
      const endTime = new Date();
      const timeEnd = req.body.shift.end.split(":");
      const hoursEnd = Number(timeEnd[0]);
	const minutesEnd = Number(timeEnd[1]);
      endTime.setHours(hoursEnd);
      endTime.setMinutes(minutesEnd);
      endTime.setSeconds(0);
      endTime.setMilliseconds(0);

      const duration = Math.abs((endTime - startTime)/(1000 * 60 * 60))
      
      req.body.shift.duration = duration;
      console.log(req.user);
      console.log(req.body.shift);
      req.body.shift.authorId = req.user._id;
	Shift.create(req.body.shift, function (err, newShift) {
		if (!err && newShift) {
                  req.flash("success", "Successfully created new shift");
                  return res.redirect("/shifts");
            }
            req.flash("error", "Something went wrong while creating new shift class");
            res.redirect("/shifts");
	});
});

// 4. Show route - shows/get info about one specific shift class
router.get("/shifts/:id", isLoggedIn, isAdmin, function (req, res) {
	Shift.findById(req.params.id, function (err, foundShift) {
        if (!err && foundShift) {
            return res.render("shifts/show", { shift: foundShift, title: "shifts" });
		}
        req.flash("error", "Invalid shift class id. Shift class does not exist");
        res.redirect("/shifts");
	});
});

// 5. Edit route - renders edit form to edit one particular shift class
router.get("/shifts/:id/edit", isLoggedIn, isAdmin, function (req, res) {
	Shift.findById(req.params.id, function (err, shiftClass) {
		if (!err || shiftClass) {
                 return res.render("shifts/edit", { shiftClass, title: "shifts" });
		}
        req.flash("error", "Error occured while fetching shift class");
        return res.redirect("/shifts");
	});
});

// 6. Update route - Puts edited info about one particular breakdown in the database
router.put("/shifts/:id", isLoggedIn, isAdmin, function (req, res) {
      console.log(req.params.id)
	Shift.findByIdAndUpdate(req.params.id, req.body.shift, function (err, updatedShiftClass) {
		if (!err || updatedShiftClass) {
            req.flash("success", "Successfully updated shift class");
            return res.redirect("/shifts/" + updatedShiftClass._id);
		}
            console.log(err)
            req.flash("error", "Error occured while updating shift class");
            res.redirect("/shifts/" + req.params.id + "/edit");
	});
});

router.delete("/shifts/:id", isLoggedIn, isAdmin, function (req, res) {
	Shift.findByIdAndRemove(req.params.id, function (err) {
		if (!err) {
            req.flash("success", "Successfully deleted shift class");
            return res.redirect("/shifts");
		}
        req.flash("error", "Shift class not deleted. Something went wrong");
        res.redirect("shifts");
	});
});

module.exports = router;
