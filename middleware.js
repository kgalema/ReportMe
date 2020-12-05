const Section = require("./models/section")
const Redpanel = require("./models/tarp")
const Production = require("./models/production")



module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.url)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash("error", "You need to be logged in first")
        return res.redirect("/login")
    }
    next()
}

module.exports.isAuthor = (req, res, next) => {
    console.log(req.user.isAdmin)
    Redpanel.findById(req.params.redpanel_id, function (err, foundRed) {
        if (err) {
            console.log(err)
            req.flash("error", "Something went wrong")
            return res.redirect(`/redPanel/${req.params.redpanel_id}`)
        }
        console.log(foundRed)
        if (!foundRed.author.equals(req.user._id) && !(req.user.isAdmin)) {
            console.log("You dont have permission to do that(edit)")
            req.flash("error", "You do not have permission to do that")
            return res.redirect(`/redPanel/${req.params.redpanel_id}`)
        }
        console.log("hit next")
        next()
    })
}


module.exports.isSectionAuthor = (req, res, next) => {
    Section.findById(req.params.id, function (err, foundSection) {
        if (err) {
            console.log(err)
            req.flash("error", "Something went wrong")
            return res.redirect(`/sections/${req.params.redpanel_id}`)
        }
        console.log(foundSection.author)
        console.log(req.user._id)
        console.log(req.user.isAdmin)
        if (!foundSection.author.equals(req.user._id) && !req.user.isAdmin) {
            console.log("You dont have permission to do that(edit section)")
            req.flash("error", "You do not have permission to do that")
            return res.redirect(`/sections/${req.params.id}`)
        }
        console.log("hit next")
        next()
    })
}
module.exports.isProductionAuthor = (req, res, next) => {
    Production.findById(req.params.id, function (err, foundProduction) {
        if (err) {
            console.log(err)
            req.flash("error", "Something went wrong")
            return res.redirect(`/production/${req.params.redpanel_id}`)
        }
        console.log(foundProduction.author)
        console.log(req.user._id)
        console.log(req.user.isAdmin)
        if (!foundProduction.author.equals(req.user._id) && !req.user.isAdmin) {
            console.log("You dont have permission to do that(edit section)")
            req.flash("error", "You do not have permission to do that")
            return res.redirect(`/production/${req.params.production}`)
        }
        console.log("hit next")
        next()
    })
}