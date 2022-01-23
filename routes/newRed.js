const express = require("express");
const router = express.Router();
const Section = require("../models/section");
const NewRedPanel = require("../models/newRed");
const User = require("../models/user");
const { isLoggedIn, isNewRedAuthor, isSectionSelected } = require("../middleware");
// const ExpressError = require("../utils/ExpressError")
// const nodemailer = require("nodemailer")


// 1. Index routes -renders a list for all new red panels
router.get("/newRedPanels", function (req, res) {
    res.redirect("/redPanel");
})

// 2. New Route - renders a form for adding new red panel
router.get("/sections/:id/newReds/new", isLoggedIn, isSectionSelected, function (req, res) {
    Section.findById(req.params.id, function (err, foundSection) {
        if (err || !foundSection) {
            req.flash("error", "Selected section id does not exist");
            return res.redirect(`/redPanel`);
        }
        res.render("newReds/new", { section: foundSection, title: "TARP-Red" });
    });
});

// 3. Create route - creates a tarp red panel data
router.post("/sections/:id/newRedPanels", isLoggedIn, function (req, res) {
    Section.findById(req.params.id, function (err, section) {
        if (err || !section) {
            req.flash("error", "No section with such id exists");
            return res.redirect("/sections");
        }
        NewRedPanel.create(req.body.newRed, function(err, createdRed){
            if(err || !createdRed){
                req.flash("error", "Error occured while creating TARP red");
                return res.redirect("/redPanel");
            }
            createdRed.section.id = section._id;
            createdRed.section.name = section.name;
            createdRed.author.id = req.user._id;
            createdRed.save(function (err, savedRed) {
                if(err || !savedRed){
                    req.flash("error", "Could not assign section to created red panel");
                    return res.redirect("/redPanel");
                }

                    // let mailOptions = {
                    //     to: "ronny.kgalema@gmail.com",
                    //     from: "User <kdlreports@outlook.com>",
                    //     priority: "high",
                    //     subject: "TARP Visit Request",
                    //     replyTo: "ronny.kgalema@gmail.com",
                    //     text: 'Good day, TARP team\n\n' +
                    //         'A TARP visit is requested at ' + savedRed.section.name + ' for panel: \n\n' +
                    //         'Panel name: '+ savedRed.panel + '\n' +
                    //         'Trigger(s): '+ savedRed.triggers + '\n'+ 
                    //         'Date declared: ' + savedRed.dateDeclared + '\n',  
                    // };

                    // let smtpTransport = nodemailer.createTransport({
                        // service: "outlook",
                        // host: "smtp.live.com",
                        // secure: false,
                        // port: 587,
                        // auth: {
                            // user: "kdlreports@outlook.com",
                            // pass: process.env.GMAILPW
                        // }
                    // });

                    // smtpTransport.sendMail(mailOptions, function (err, info) {
                    //     if(err){
                    //         console.log(err)
                    //         req.flash("error", "Email not sent. Please send the email manually and notify admin")
                    //         return res.redirect("/redPanel")
                    //     }
                    //     smtpTransport.close()
                    // });
                req.flash("success", `Added TARP Red panel`);
                res.redirect("/redPanel");
            });
        });
    });
});

// 4. Show route - shows info about one specific redpanel
router.get("/newRedPanel/:id", function (req, res) {
    NewRedPanel.findById(req.params.id, function (err, foundNewRedPanel) {
        if (err || !foundNewRedPanel) {
            req.flash("error", "Cannot find requested TARP Red panel");
            return res.redirect("/redPanel");
        }
        User.findById(foundNewRedPanel.author.id, { email: 1 }, function (err, user) {
			if (err || !user) {
				req.flash("error", "Looks like the TARP red panel does not have author");
				return res.redirect("back");
			}
            res.render("newReds/show", { newRedPanel: foundNewRedPanel, redUser: user, title: "TARP-Red" });
		});
    });
})

// 5. Edit route - Edit a specific new redpanel (Renders a form)
router.get("/sections/:id/newRedPanel/:newRedPanel_id/edit", isLoggedIn, isNewRedAuthor, function (req, res) {
    NewRedPanel.findById(req.params.newRedPanel_id, function (err, foundNewRed) {
        if (err || !foundNewRed) {
            req.flash("error", "TARP Red panel does not exist with such id");
            return res.redirect("/redPanel");
        } 
        res.render("newReds/edit", { section_id: req.params.id, newRedPanel: foundNewRed, title: "TARP-Red" });
    });
});

// 6. Update route - Puts the supplied info from edit form into the database
router.put("/sections/:id/newRedPanel/:newRedPanel_id", isLoggedIn, isNewRedAuthor, function (req, res) {
    NewRedPanel.findByIdAndUpdate(req.params.newRedPanel_id, req.body.newRedPanel, function (err, updatedNewRedPanel) {
        if (err || !updatedNewRedPanel) {
            req.flash("error", "Cannot find requested TARP Red panel")
            return res.redirect("/redPanel")
        }
        req.flash("success", "Successfully updated a TARP Red panel")
        res.redirect("/newRedPanel/" + req.params.newRedPanel_id)
    })
})
// 7. Delete route - Delete particular red panel
router.delete("/sections/:id/newRedPanel/:newRedPanel_id", isLoggedIn, isNewRedAuthor, function (req, res) {
    NewRedPanel.findByIdAndRemove(req.params.newRedPanel_id, function (err) {
        if (err) {
            req.flash("error", "Oops! Something went wrong. Panel not deleted");
            return res.redirect("/redPanel");
        }
        req.flash("success", "Successfully deleted a TARP red panel");
        res.redirect("/redPanel");
    });
});


module.exports = router;