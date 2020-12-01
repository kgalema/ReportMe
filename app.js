require('dotenv').config();
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


const redPanelsRoutes = require("./routes/redPanels")
const sectionsRoutes = require("./routes/sections")
const productionRoutes = require("./routes/production")
const accessRoutes = require("./routes/access")
const rehabilitated = require("./routes/rehabilitated")
const userRoutes = require("./routes/access")



// ==================end here====================

// mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
const connection = mongoose.connect("mongodb://localhost/reportMe", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})
	.then(() => console.log("Connected to DB"))
	.catch(error => console.log(error.message));

// const storage = new GridFSStorage({ db: connection })
// const storage = new GridFSStorage({
// 	db: connection,
// 	file: (req, file) => {
// 		return { filename: new Date() + "_file" }
// 	}
// })

// const upload = multer({ storage: storage });
const sessionOptions = {
	resave: false,
	saveUninitialized: true,
	secret: "secret",
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}
app.use(session(sessionOptions))
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