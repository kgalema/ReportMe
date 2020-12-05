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
const GridFSStorage = require("multer-gridfs-storage")
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user")

const MongoStore = require("connect-mongo")(session)

const redPanelsRoutes = require("./routes/redPanels")
const sectionsRoutes = require("./routes/sections")
const productionRoutes = require("./routes/production")
const accessRoutes = require("./routes/access")
const rehabilitated = require("./routes/rehabilitated")
const userRoutes = require("./routes/access")



// ==================end here====================

// const dbUrl = "mongodb://localhost/reportMe"
const dbUrl = process.env.DB_URL || "mongodb://localhost/reportMe";

mongoose.set('useFindAndModify', false);
const connection = mongoose.connect(dbUrl, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})
	.then(() => console.log("Connected to DB"))
	.catch(error => {
		console.log(error.message);
	});

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


app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
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
app.use(sectionsRoutes)
app.use(productionRoutes)
app.use(accessRoutes)
app.use(rehabilitated)


let port = process.env.PORT;
if (port == null || port == "") {
	port = 4000;
};

app.listen(port, () => console.log(`ReportMe server is running on port ${port}`));