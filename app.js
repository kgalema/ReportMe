const process = require("process")
if (process.env.NODE_ENV !== "production") {
	require('dotenv').config();
}

const http = require("http");
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const expressSanitizer = require("express-sanitizer")
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require("connect-flash")
const ExpressError = require('./utils/ExpressError');
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user")


const port = process.env.PORT || 4000;

const dbUrl = "mongodb://localhost/reportMe";
// const dbUrl = process.env.DB_URL
const DBoptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
}


const options = {
  hostname: "localhost",
  port: port,
  path: "/database-problem",
  method: "GET"
};


//**************Database problem handling***********


// app.get("/database-problem", (req, res) => {
// 	console.log("********************Inside A Route*****************************")
// 	res.send("You've hit database problem route")
// })


// const req = http.request(options, (res) => {
//   	console.log(`statusCode: ${res.statusCode}`);
// 	res.on("data", (d) => {
// 		process.stdout.write(d);
// 	});
// });

// req.on("error", (error) => {
//   	console.error(error);
// });

// req.end();


//******************************************************************************
const database = async function () {
	try {
		console.log("connecting to database using connect to Database function...........");
  		let connectionInside = await mongoose.connect(dbUrl, DBoptions);
		console.log("Connected to database")
		return connectionInside;
	
	} catch (error) {
		console.log(error)
		console.log("Error is caught")
  		process.exit()
	}
}

database()

const conn1 = mongoose.connection


conn1.once("open", function(){
	console.log("******connection open*******")
})
conn1.on("error", function(){
	console.log("******On error*******")
	process.exit()
})

conn1.on("disconnected", function(){
	console.log("*******On disconnected******")
	database()
})

module.exports.dbUrl = dbUrl
module.exports.connection = conn1
//**************************Database Setup End****************************************

const MongoStore = require("connect-mongo")(session);

const redPanelsRoutes = require("./routes/redPanels");
const newRedPanelsRoutes = require("./routes/newRed");
const sectionsRoutes = require("./routes/sections");
const productionRoutes = require("./routes/production");
const accessRoutes = require("./routes/access");
const rehabilitated = require("./routes/rehabilitated");
const usersRoutes = require("./routes/users");
const romRoutes = require("./routes/rom");
const plantFeedRoutes = require("./routes/plantFeed");
const newReportsRoutes = require("./routes/newReport");
const tmms = require("./routes/tmms");
const breakdowns = require("./routes/breakdowns");
const closedBreakdowns = require("./routes/closedBreakdown");



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
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	res.locals.warning = req.flash('warning');
	next();
});



app.use(usersRoutes)
app.use(redPanelsRoutes)
app.use(newRedPanelsRoutes)
app.use(sectionsRoutes)
app.use(productionRoutes)
app.use(accessRoutes)
app.use(rehabilitated)
app.use(romRoutes)
app.use(plantFeedRoutes)
app.use(newReportsRoutes)
app.use(tmms)
app.use(breakdowns)
app.use(closedBreakdowns)


app.all("*", (req, res, next) => {
	console.log("Resource not found")
	return next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res,next) => {
	console.log("hey there")
	console.log(err.name);
	next(err)
})

app.use((err, req, res, next) => {
	// console.log(req)
	console.log("from express error middleware")
	const { statusCode = 500 } = err
	if (!err.message) err.message = "Oh No, Something Went Wrong!";
	res.status(statusCode).render('error', { title: "title", err })
	// res.status(statusCode).send(err.message)
})

// const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`ReportMe server is running on port ${port}`));