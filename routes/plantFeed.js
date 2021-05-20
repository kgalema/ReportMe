const express = require("express")
const router = express.Router()
const PlantFeed = require("../models/plantFeed")

const moment = require("moment")
const { isLoggedIn, isProductionAuthor } = require("../middleware")

// 1. Index Route
router.get("/plantFeed", function (req, res) {
    PlantFeed.find({}, function (err, feeds) {
        if (err) {
            return res.next(err)
        }
        res.render("plantfeed/index", { feeds: feeds, title: "sections" })
    })
})

// 2. New Route - for rendering a new plant-feed form
router.get("/plantFeed/new", function (req, res) {
    res.render("plantfeed/new", { title: "production-report" })
})
// 3. Create Route - post captured data into database
router.post("/plantFeed", function (req, res) {
    // console.log("Hey")
    PlantFeed.create(req.body.plantFeed, function (err, createdPlantFeed) {
        if (err) {
            // console.log(err)
            req.flash("error", "Looks like you are trying to create duplicate report")
            return res.redirect("back")
        } else {
            createdPlantFeed.author.id = req.user._id
            createdPlantFeed.save(function (err, savedCreatedPlantFeed) {
                if (err) {
                    console.log(err + "Error occured while linking user and C1 Entry")
                    req.flash("error", "Error occured while linking user and C1 Entry")
                    return res.redirect("back")
                }
                req.flash("success", "Successfully Added C1 Entry")
                res.redirect("/plantFeed")
            })
        }
    })
})
// 4. Show Route - Show specific captured plant-feed entry with unique id
router.get("/plantFeed/:id", function (req, res) {
    PlantFeed.findById(req.params.id, function (err, foundPlantFeed) {
        if (err || !foundPlantFeed) {
            req.flash("error", "Something went wrong while fetching PlantFeed")
            return res.redirect("back")
        } else {
            res.render("plantfeed/show", { foundPlantFeed: foundPlantFeed, title: "sections" })
        }
    })
})

// 5. Edit Route - Renders a form for editting
router.get("/plantFeed/:id/edit", function (req, res) {
    PlantFeed.findById(req.params.id, function (err, editPlantFeed) {
        if (err || !editPlantFeed) {
            req.flash("error, Something went wrong while fetching PlantFeed")
            return res.redirect("back")
        }
        res.render("plantfeed/edit", { editPlantFeed: editPlantFeed, title: "production-report" })
    })
})
// 6. Updated Route - Posts the updated info and overrides what's in the databse
router.put("/plantFeed/:id", function (req, res) {
    PlantFeed.findByIdAndUpdate(req.params.id, req.body.plantFeed, function (err, updatedPlantFeed) {
        if (err || !updatedPlantFeed) {
            console.log(err)
            req.flash("error", "Something went wrong with the database")
            return res.redirect("back")
        } else {
            // console.log(updatedProduction)
            req.flash("success", "Successfully Updated Production Report")
            res.redirect("/plantFeed")
        }
    })
})
// 7. Delete Route - For deleting one specific plant-feed captured
router.delete("/plantFeed/:id", function (req, res) {
    PlantFeed.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            req.flash("error", "Something went wrong while deleting")
            return res.redirect("back")
        } else {
            req.flash("success", "Successfully Deleted Production Report")
            res.redirect("/plantFeed")
        }
    })
})


module.exports = router;
