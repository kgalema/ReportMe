const express = require("express");
const router = express.Router();
const Section = require("../models/section");

// 1. Index routes -renders a page with options for new report
router.get("/newReport", function (req, res) {
  Section.find({}, function (err, sections) {
    if (err || !sections) {
      req.flash("error", "Error occured while fetching sections");
      return res.redirect("back");
    }
     res.render("general/newReport", {sections: sections, title: "new-reports"});
  });
});
// 2. @Post captured inform to render a relevant form according to the user's request
router.post("/newReport", function (req, res) {
    const {section, report} = req.body.newReport
    if(report === "production"){
        return res.redirect("/sections/"+ section +"/production/new");
    }
    if(report === "TARP"){
        return res.redirect("/sections/" + section + "/newReds/new");
    }
});

module.exports = router;
