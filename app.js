const process = require("process")
if (process.env.NODE_ENV !== "production") {
	require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const expressSanitizer = require("express-sanitizer");
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require("connect-flash");
const ExpressError = require('./utils/ExpressError');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
require('./initDB');


// Middleware for license will be here
app.use((req, res, next)=> {
	const expires = 1649018491130 + 1000 * 60 * 60 * 24 * 182;
	console.log(new Date(expires))
	if(Date.now() > expires){
		console.log(Date.now())
		return res.send("Your trial has ended. Contact declaration.co.za")
	}
	console.log("License still active")
	next()
})
const port = process.env.PORT || 4000;

const dbUrl = "mongodb://localhost/reportMe";
// const dbUrl = process.env.DB_URL
const DBoptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
	// socketTimeoutMS: 5000,
	// serverSelectionTimeoutMS: 5000,
	// heartbeatFrequencyMS: 5000
};

//***************************************************/
const connectWithDB = () => {
	mongoose.connect(dbUrl, DBoptions, (err, db) => {
		console.log("Connecting to database using connect to connectWithDB function");
		if (err) {
			console.log("Error occured while connecting to DB")
			console.error(err.name);
		}else {
			console.log("database connection");
			// console.log(db)
		}
	});
};

//***************************************************/

connectWithDB();



//Check for connection.db
const conn1 = mongoose.connection

conn1.on('connected', () => {
	console.log("On connected emmited*******************************************")
})
conn1.once("open", function(e){
	console.log("******Connection Open Inside Once Open Listener*******");

	const MongoStore = require("connect-mongo")(session);

	const secret = process.env.SECRET || "highSchoolCrush";

	const store = new MongoStore({
		url: dbUrl,
		secret,
		touchAfter: 24 * 60 * 60,
	});

	store.on("error", function (e) {
		console.log("SESSION STORE ERROR", e);
	});

	const sessionConfig = {
		store,
		name: "session",
		secret,
		resave: false,
		saveUninitialized: true,
		cookie: {
			httpOnly: true,
			expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
			maxAge: 1000 * 60 * 60 * 24 * 7,
		},
	};

	//***********Set up flash start *****/
	app.use(session(sessionConfig));
	app.use(flash());
	//***********flash set up complete *****/

	/** Configuring passport and insuring persistant loging using session **/
	app.use(passport.initialize());
	app.use(passport.session());
	passport.use(new LocalStrategy(User.authenticate()));
	passport.serializeUser(User.serializeUser());
	passport.deserializeUser(User.deserializeUser());
	/** Finish Configuring passport and insuring persistant loging using session **/

	app.use((req, res, next) => {
		res.locals.currentUser = req.user;
		res.locals.success = req.flash("success");
		res.locals.error = req.flash("error");
		res.locals.warning = req.flash("warning");
		next();
	});
});

conn1.on("error", function(e){
	console.log("******On Connection Error*******")
	console.log(`Error occured when connectng to DB with name: ${e.name} and message: ${e.message}`)
	connectWithDB();
})

conn1.on("disconnected", function(){
	console.log("*******Connection disconnected******")
	// console.log(app._router.stack)
})

conn1.on("reconnected", function(){
	console.log("*******Reconnected after losing connection DB******")
	// console.log(app._router.stack)
})
conn1.on("reconnectFailed", function(){
	console.log("*******Reconnecting to DB failed******")
	// console.log(app._router.stack)
})
conn1.on("close", function(){
	console.log("*******Connection successfuly closed******")
	// console.log(app._router.stack)
})

process.on("SIGINT", async () => {
	await conn1.close()
	process.exit(0)
})

module.exports.dbUrl = dbUrl
module.exports.connection = conn1
module.exports.app = app
//**************************Database Setup End****************************************



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
const shiftsRoutes = require("./routes/shift");
const productionCalendarRoutes = require("./routes/productionCalendar");

// app.use((req, res, next) => {
// 	console.log("App dot use is working");
// 	console.log("******************************************************");
// 	next();
// });

// const MongoStore = require("connect-mongo")(session);

// const secret = process.env.SECRET || "highSchoolCrush";


// const store = new MongoStore({
// 	url: dbUrl,
// 	secret,
// 	touchAfter: 24 * 60 * 60,
// });

// console.log("****Hello there*****")

// store.on("error", function (e) {
// 	console.log("SESSION STORE ERROR", e);
// });


// const sessionConfig = {
// 	store,
// 	name: "session",
// 	secret,
// 	resave: false,
// 	saveUninitialized: true,
// 	cookie: {
// 		httpOnly: true,
// 		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
// 		maxAge: 1000 * 60 * 60 * 24 * 7,
// 	},
// };


//***********Set up flash start *****/
// app.use(session(sessionConfig))
// app.use(flash())
//***********flash set up complete *****/

/**Configuring passport and insuring persistant loging using session */
// app.use(passport.initialize())
// app.use(passport.session())
// passport.use(new LocalStrategy(User.authenticate()))
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}))

// Parse application/json
app.use(express.json()) 

// app.use(express.static("public"))
app.use(express.static(path.join(__dirname, "public")))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '/views'))

app.use(expressSanitizer());
app.use(methodOverride("_method"));


app.locals.moment = require("moment");
// app.use((req, res, next) => {
	// res.locals.currentUser = req.user;
	// console.log("Control middleware")
	// res.locals.success = req.flash('success');
	// res.locals.error = req.flash('error');
	// res.locals.warning = req.flash('warning');
	// next();
// });

app.use(usersRoutes);
app.use(redPanelsRoutes);
app.use(newRedPanelsRoutes);
app.use(sectionsRoutes);
app.use(productionRoutes);
app.use(accessRoutes);
app.use(rehabilitated);
app.use(romRoutes);
app.use(plantFeedRoutes);
app.use(newReportsRoutes);
app.use(tmms);
app.use(breakdowns);
app.use(closedBreakdowns);
app.use(shiftsRoutes);
app.use(productionCalendarRoutes);

conn1.once("open", () => {
	// console.log("Inside connection being open")
	console.log("**********Before removing all routers***************");
	console.log(app._router.stack.length);
	for (let i = 0; i < app._router.stack.length; i++) {
		// console.log(i)
		if (app._router.stack[i].name === "router") {
			app._router.stack.splice(i, 1);
			i--;
			// console.log(i)
		}
	}
	// console.log(app._router.stack);
	console.log('**********After removing all routers**************')
	console.log(app._router.stack.length);

	

	// console.log(app._router.stack[11].handle);
	// console.log(app._router.stack[12].handle);
	// process.stdout.write(app._router.stack.length + "\n");
	app.use(usersRoutes);
	app.use(redPanelsRoutes);
	app.use(newRedPanelsRoutes);
	app.use(sectionsRoutes);
	app.use(productionRoutes);
	app.use(accessRoutes);
	app.use(rehabilitated);
	app.use(romRoutes);
	app.use(plantFeedRoutes);
	app.use(newReportsRoutes);
	app.use(tmms);
	app.use(breakdowns);
	app.use(closedBreakdowns);
	app.use(shiftsRoutes);
	app.use(productionCalendarRoutes);


	// Moving an item from index to another index
	function arraymove(arr, fromIndex, toIndex) {
		const element = arr[fromIndex];
		arr.splice(fromIndex, 1);
		arr.splice(toIndex, 0, element);
	}

	const starMiddlewareIndex = app._router.stack.findIndex(getIndex);
	function getIndex(layerName) {
		return layerName.name === "bound dispatch" && layerName.route.path === "*";
	}

	const lastErrHandlingMiddlewareIndex = app._router.stack.findIndex(getIndexOfLast);
	function getIndexOfLast(layerName) {
		return layerName.name === "lastMiddlware";
	}

	// console.log("Selected middleware");
	// console.log(starMiddlewareIndex);
	// console.log(lastErrHandlingMiddlewareIndex);

	// console.log("*********Printing********")
	// console.log(app._router.stack[starMiddlewareIndex].route.path);
	// console.log(app._router.stack[26].handle)
	const lastItemOfStack = app._router.stack.length - 1;
	const secondLastItemOfStack = app._router.stack.length - 2;
	// console.log(lastItemOfStack)
	// console.log(secondLastItemOfStack)
	arraymove(app._router.stack, lastErrHandlingMiddlewareIndex, lastItemOfStack);
	arraymove(app._router.stack, starMiddlewareIndex, secondLastItemOfStack);

	// console.log(app._router.stack)

	// console.log("*****After adding other middlwares*****")
	// console.log(app._router.stack);
	// console.log(app._router.stack.length);
	// console.log(app._router.stack[11]);
	// process.stdout.write(app._router.stack[28].handle + "\n");
	// process.stdout.write(app._router.stack[12].handle + "\n");
	// process.stdout.write(app._router.stack[27].handle + "\n");
	// console.log(app._router.stack[12]);
	// console.log(app._router.stack[11].handle);
	// console.log(app._router.stack[12].handle);
})


app.all("*", (req, res, next) => {
	console.log("Resource not found")
	return next(new ExpressError("Page requested does not exist. Check URL and try again", 404))
});


const lastMiddlware = (err, req, res, next) => {
	console.log("Error handling middleware at app.js:278");
	const { statusCode = 500 } = err;
	console.log(err.name);
	if (err.name === "MongoServerSelectionError") {
		// return res.send("Database is down. Contact admin");
		return res.render("welcomePage");
	}
	if (err.name === "MongooseServerSelectionError") {
		// return res.send("Database is down. Contact admin");
		return res.render("welcomePage");
	}
	if (!err.message) err.message = "Oh No, Something Went Wrong!";
	res.status(statusCode).render("error", { title: "title", err });
};

app.use(lastMiddlware)


app.listen(port, () => console.log(`ReportMe server is running on port ${port}`));