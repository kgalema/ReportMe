if (process.env.NODE_ENV !== "production") {
	require('dotenv').config();
}

const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const expressSanitizer = require("express-sanitizer")
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require("connect-flash")
const path = require("path")
const fs = require("fs")
const ExpressError = require('./utils/ExpressError');
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user")
const crypto = require('crypto')


// ****************************Database Setup Start*************************************
const dbUrl = "mongodb://localhost/reportMe";
// const dbUrl = process.env.DB_URL || "mongodb://localhost/reportMe";
const DBoptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
}

mongoose.connect(dbUrl, DBoptions, function (err) {
	if (err) {
		console.log("*******first error*********")
		console.log(err)
		console.log("*******first error*********")
	}
	console.log("Connected to the database")
});



const conn1 = mongoose.connection


conn1.on("error", function(err){
	console.log("******On error*******")
	console.log(err)
	console.log("******On error*******")
})

conn1.on("disconnected", function(err){
	console.log("*******On disconnected******")
	console.log(err)
	console.log("*******On disconnected******")
})

module.exports.dbUrl = dbUrl
module.exports.connection = conn1
//**************************Database Setup End****************************************

const MongoStore = require("connect-mongo")(session)

const redPanelsRoutes = require("./routes/redPanels");
const newRedPanelsRoutes = require("./routes/newRed");
const sectionsRoutes = require("./routes/sections");
const productionRoutes = require("./routes/production");
const accessRoutes = require("./routes/access")
const rehabilitated = require("./routes/rehabilitated");
const userRoutes = require("./routes/access");
const romRoutes = require("./routes/rom");
const plantFeedRoutes = require("./routes/plantFeed");


const secret = process.env.SECRET || "highSchoolCrush";

const store = new MongoStore({
	url: dbUrl,
	secret,
	touchAfter: 24 * 60 * 60
})

store.on("error", function (e) {
	console.log("SESSION STORE ERROR", e)
})


const sessionConfig = {
	store,
	name: "session",
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}






app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// ***Parse application/x-www-form-urlencoded***
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({extended: true}))

// ***Parse application/json***
// app.use(bodyParser.json())
app.use(express.json()) 

app.use(express.static("public"))
// app.use(express.static("uploads"))
app.set("view engine", "ejs")

app.use(expressSanitizer());
app.use(methodOverride("_method"));


app.locals.moment = require("moment");
app.use((req, res, next) => {
	res.locals.currentUser = req.user
	res.locals.success = req.flash('success')
	res.locals.error = req.flash('error')
	next()
})



app.use(userRoutes)
app.use(redPanelsRoutes)
app.use(newRedPanelsRoutes)
app.use(sectionsRoutes)
app.use(productionRoutes)
app.use(accessRoutes)
app.use(rehabilitated)
app.use(romRoutes)
app.use(plantFeedRoutes)


app.all("*", (req, res, next) => {
	console.log("Resource not found")
	return next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
	// console.log(req)
	console.log("from express error middleware")
	const { statusCode = 500 } = err
	if (!err.message) err.message = "Oh No, Something Went Wrong!";
	res.status(statusCode).render('error', { title: "title", err })
	// res.status(statusCode).send(err.message)
})

const port = process.env.PORT || 4000;
// if (port == null || port == "") {
// 	port = 4000;
// };

app.listen(port, () => console.log(`ReportMe server is running on port ${port}`));