const Section = require("./models/section")
const Redpanel = require("./models/tarp")
const Production = require("./models/production")
const NewRedPanel = require("./models/newRed")
const User = require("./models/user")



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash("error", "You need to be logged in first")
        return res.redirect("/login")
    }
    next()
}

module.exports.isAuthor = (req, res, next) => {
    Redpanel.findById(req.params.redpanel_id, function (err, foundRed) {
        if (err) {
            req.flash("error", "Something went wrong")
            return res.redirect(`/redPanel/${req.params.redpanel_id}`)
        }
        if (!foundRed.author.equals(req.user._id) && !(req.user.isAdmin)) {
            req.flash("error", "You do not have permission to do that")
            return res.redirect(`/redPanel/${req.params.redpanel_id}`)
        }
        next()
    })
}


module.exports.isSectionAuthor = (req, res, next) => {
    Section.findById(req.params.id, function (err, foundSection) {
        if (err) {
            req.flash("error", "Something went wrong")
            return res.redirect(`/sections/${req.params.redpanel_id}`)
        }
        
        if (!foundSection.author.equals(req.user._id) && !req.user.isAdmin) {
            req.flash("error", "You do not have permission to do that")
            return res.redirect(`/sections/${req.params.id}`)
        }
        next()
    })
}
module.exports.isProductionAuthor = (req, res, next) => {
    Production.findById(req.params.production_id, function (err, foundProduction) {
        if (err) {
            req.flash("error", "Something went wrong")
            return res.redirect(`/sections/${foundProduction.section.id}/production/${req.params.production_id}`)
        }
        if (!foundProduction.author.equals(req.user._id) && !req.user.isAdmin) {
            req.flash("error", "You do not have permission to do that")
            return res.redirect(`/sections/${foundProduction.section.id}/production/${req.params.production_id}`)
        }
        next()
    })
}

module.exports.isNewRedAuthor = (req, res, next) => {
    NewRedPanel.findById(req.params.newRedPanel_id, function (err, foundNewRed) {
        if (err || !foundNewRed) {
            req.flash("error", "Something went wrong while checking author")
            return res.redirect("back")
        }

        if (!foundNewRed.author.equals(req.user._id) && !req.user.isAdmin) {
            req.flash("error", "You do not have permission to do that")
            return res.redirect("back")
        }
        next()
    })
}
module.exports.isAdmin = (req, res, next) => {
    User.findById(req.user._id, function (err, foundUser) {
        if (err || !foundUser) {
            req.flash("error", "Something went wrong while checking user")
            return res.redirect("back")
        }

        if (!req.user.isAdmin) {
            req.flash("error", "You do not have permission to do that. Contact Admin")
            return res.redirect("back")
        }
        next()
    })
}
module.exports.isSectionSelected = (req, res, next) => {
    Section.findById(req.params.id, function (err, foundSection) {
        if (err || !foundSection ) {
            req.session.returnTo = req.originalUrl
            req.flash("error", "Please select a section to proceed")
            return res.redirect("/sections")
        }
        next()
    })
}