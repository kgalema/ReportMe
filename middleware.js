module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.url)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash("error", "You need to be logged in first")
        return res.redirect("/login")
    }
    next()
}