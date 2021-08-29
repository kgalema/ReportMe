const express = require("express");
const router = express.Router();
const TMM = require("../models/tmms")
const { isLoggedIn, isAdmin } = require("../middleware");

//================
// TMMS routes
//================

// 1. Index route -list all TMMS
router.get("/tmms", isLoggedIn, isAdmin, function (req, res) {
    TMM.find({}, function (err, allTMMs) {
        if (err || !allTMMs) {
            req.flash("error", "Error occured while fetching all TMMs");
            return res.redirect("/");
        }
        
        const collator = new Intl.Collator(undefined, {
          numeric: true,
          sensitivity: "base",
        });

        let sorted = allTMMs.sort(function(a, b){
            return collator.compare(a.name, b.name)
        })


        let bolters = sorted.filter((b) => b.category === "roofBolter");
        let drillRigs = sorted.filter((dR) => dR.category === "drillRig");
        let LHDs = sorted.filter((LHD) => LHD.category === "LHD");
        let UVs = sorted.filter((UV) => UV.category === "UV");
        let LDVs = sorted.filter((LDV) => LDV.category === "LDV");
        let otherTMMs = sorted.filter((other) => other.category === "Other");
        res.render("tmms/index", {
            bolters: bolters,
            drillRigs: drillRigs,
            LHDs: LHDs,
            LDVs: LDVs,
            UVs: UVs,
            otherTMMs: otherTMMs,
            title: "tmms",
        });
    });
        // .sort({ name: 1 })
});

// 2. New route - renders a for creating new TMM
router.get("/tmms/new", isLoggedIn, isAdmin, function (req, res) {
    res.render("tmms/new", { title: "tmms"});
});

// 3. Create route - post a new TMM into the database then redirect elsewhere
router.post("/tmms", isLoggedIn, isAdmin, function (req, res) {
    TMM.create(req.body.TMM, function (err, newTMM) {
        if (err || !newTMM) {
            console.log(err)
            req.flash("error", "Something went wrong while creating new TMM");
            return res.redirect("/tmms/new");
        }
        newTMM.author.id = req.user._id;
        newTMM.save(function (err, savedTMM) {
        if (err || !savedTMM) {
            req.flash("error", "Something went wrong while associating user with TMM");
            return res.redirect("/tmms/new");
        }
        req.flash("success", "Successfully added new TMM");
        res.redirect("/tmms");
        });
    });
});


// 4. Show route - shows/get info about one specific TMM
router.get("/tmm/:id", isLoggedIn, isAdmin, function (req, res) {
    TMM.findById(req.params.id, function (err, foundTMM) {
        if (err || !foundTMM) {
        req.flash("error", "TMM not found");
        return res.redirect("/tmms");
        } 
        res.render("tmms/show", { tmm: foundTMM, title: "tmms" });
    });
});

// 5. Edit route - renders edit form to edit one particular TMM
router.get("/tmm/:id/edit", isLoggedIn, isAdmin, function (req, res) {
    TMM.findById(req.params.id, function (err, tmm) {
        if (err || !tmm) {
            req.flash("error", "TMM not found");
            return res.redirect("/tmms");
        }
        res.render("tmms/edit", {tmm: tmm, title: "tmms"});
    });
});

// 6. Update route - Puts edited info about one particular TMM in the database
router.put("/tmm/:id", isLoggedIn, isAdmin, function (req, res) {
    TMM.findByIdAndUpdate(req.params.id, req.body.TMM, function (err, updatedTMM) {
        if (err || !updatedTMM) {
            req.flash("error", "Could not update selected TMM");
            return res.redirect("/tmms");
        }
        req.flash("success", "Successfully updated TMM");
        res.redirect("/tmm/" + updatedTMM._id);
    });
});

// 7. Destroy route - Deletes a particular TMM
router.delete("/tmm/:id", isLoggedIn, isAdmin, function (req, res) {
    TMM.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            req.flash("error", "Could not delete selected TMM")
            return res.redirect("/tmms");
        } 
        req.flash("success", "Successfully deleted TMM");
        res.redirect("/tmms");
    });
});

module.exports = router;
