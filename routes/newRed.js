const express = require("express")
const router = express.Router()
const Section = require("../models/section")
const NewRedPanel = require("../models/newRed")
const { isLoggedIn, isNewRedAuthor, isSectionSelected } = require("../middleware")
const ExpressError = require("../utils/ExpressError")
const nodemailer = require("nodemailer")


// 1. Index routes -renders a list for all new red panels
router.get("/newRedPanels", function (req, res) {
    console.log("hit the index route")
    NewRedPanel.find({}, function (err, newReds) {
        if (err) {
            console.log(err);
            return res.redirect("back")
        } else {
            res.render("redPanels/index", { redpanels: newReds, title: "TARP-Red" })
        }
    })
})

// 2. New Route - renders a form for adding new red panel
router.get("/sections/:id/newReds/new", isLoggedIn, isSectionSelected, function (req, res) {
    Section.findById(req.params.id, function (err, foundSection) {
        if (err) {
            console.log(err);
            return res.redirect("back")
        } else {
            res.render("newReds/new", { section: foundSection, title: "TARP-Red" })
        }
    })
})

// 3. Create route - creates a tarp red panel data
router.post("/sections/:id/newRedPanels", isLoggedIn, function (req, res, next) {
    Section.findById(req.params.id, function (err, section) {
        if (err) {
            req.flash("error", "No section with such id exists")
            return res.redirect("/sections")
        } else {
            NewRedPanel.create(req.body.newRed, function(err, createdRed){
                if(err){
                    return next(err)
                }
                createdRed.section.id = section._id
                createdRed.section.name = section.name
                createdRed.author.id = req.user._id
                createdRed.save(function (err, savedRed) {
                    if(err){
                        return next(err)
                    }

                    let mailOptions = {
                        to: "ronny.kgalema@gmail.com",
                        from: "User <kdlreports@outlook.com>",
                        priority: "high",
                        subject: "TARP Visit Request",
                        replyTo: "ronny.kgalema@gmail.com",
                        text: 'Good day, TARP team\n\n' +
                            'A TARP visit is requested at ' + savedRed.section.name + ' for panel: \n\n' +
                            'Panel name: '+ savedRed.panel + '\n' +
                            'Trigger(s): '+ savedRed.triggers + '\n'+ 
                            'Date declared: ' + savedRed.dateDeclared + '\n',  
                    };

                    let smtpTransport = nodemailer.createTransport({
                        service: "outlook",
                        host: "smtp.live.com",
                        // secure: false,
                        // port: 587,
                        auth: {
                            user: "kdlreports@outlook.com",
                            pass: process.env.GMAILPW
                        }
                    });

                    smtpTransport.sendMail(mailOptions, function (err, info) {
                        if(err){
                            console.log(err)
                            smtpTransport.close()
                            req.flash("error", "Email not sent. Please send the email manually and notify admin")
                            return res.redirect("/redPanel")
                        }
                        smtpTransport.close()
                        req.flash("success", `An email has been sent to TARP team`)
                        res.redirect("/redPanel")
                    });
                })
            })
        }
    })
})

// 4. Show route - shows info about one specific redpanel
router.get("/newRedPanel/:id", function (req, res, next) {
    NewRedPanel.findById(req.params.id, function (err, foundNewRedPanel) {
        if (err || !foundNewRedPanel) {
            req.flash("error", "Cannot find requested TARP Red panel")
            return next(new ExpressError("Invalid TARP Red Panel", 400))
        }
        res.render("newReds/show", { newRedPanel: foundNewRedPanel, title: "TARP-Red" })
    });
})

// 5. Edit route - Edit a specific new redpanel (Renders a form)
router.get("/sections/:id/newRedPanel/:newRedPanel_id/edit", isLoggedIn, isNewRedAuthor, function (req, res) {
    NewRedPanel.findById(req.params.newRedPanel_id, function (err, foundNewRed) {
        if (err || !foundNewRed) {
            req.flash("error", "Cannot find requested TARP Red panel")
            return res.redirect("/redPanel")
        } else {
            res.render("newReds/edit", { section_id: req.params.id, newRedPanel: foundNewRed, title: "TARP-Red" })
        }
    })
})

// 6. Update route - Puts the supplied info from edit form into the database
router.put("/sections/:id/newRedPanel/:newRedPanel_id", isLoggedIn, isNewRedAuthor, function (req, res) {
    NewRedPanel.findByIdAndUpdate(req.params.newRedPanel_id, req.body.newRedPanel, function (err, updatedNewRedPanel) {
        if (err || !updatedNewRedPanel) {
            req.flash("error", "Cannot find requested TARP Red panel")
            return res.redirect("/redPanel")
        } else {
            req.flash("success", "Successfully updated a TARP Red panel")
            res.redirect("/newRedPanel/" + req.params.newRedPanel_id)
        }
    })
})
// 7. Delete route - Delete particular red panel
router.delete("/sections/:id/newRedPanel/:newRedPanel_id", isLoggedIn, isNewRedAuthor, function (req, res) {
    NewRedPanel.findByIdAndRemove(req.params.newRedPanel_id, function (err) {
        if (err) {
            req.flash("error", "Oops! Something went wrong. Panel not deleted")
            return res.redirect("/redPanel")
        } else {
            req.flash("success", "Successfully deleted a TARP red panel")
            res.redirect("/redPanel")
        }
    })
})


module.exports = router;