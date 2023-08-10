const process = require("process");
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const expressSanitizer = require("express-sanitizer");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
require("./initDB");

const port = process.env.PORT || 4000;

const dbUrl = "mongodb://127.0.0.1:27017/reportMe";
// const dbUrl = "mongodb://localhost/reportMe";
// const dbUrl = "mongodb://Declaration:45declaration88@localhost:27017/reportMe";
// const dbUrl = process.env.DB_URL
const DBoptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
};

//***************************************************/
const connectWithDB = () => {
	mongoose
		.connect(dbUrl, DBoptions)
		.then(db => console.log("COONECTION SUCCESS ON FIRST ATTEMPT"))
		.catch(e => console.log(e.name, e.message));
};

//***************************************************/

connectWithDB();

//Check for connection.db
const conn1 = mongoose.connection;
// console.log(conn1)

conn1.on("connected", () => {
	console.log("On connected emmited");
});

conn1.once("open", function (e) {
	console.log("Connection Open Inside Once Open Listener");

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
		saveUninitialized: false,
		// saveUninitialized: true,
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

conn1.on("error", function (e) {
	console.log("On Connection Error");
	console.log(`Error occured when connectng to DB with name: ${e.name} and message: ${e.message}`);
	connectWithDB();
});

conn1.on("disconnected", function () {
	console.log("DB connection disconnected");
});

conn1.on("reconnected", function () {
	console.log("DB reconnected after losing connection");
});

conn1.on("reconnectFailed", function () {
	console.log("DB reconnection failed");
});

conn1.on("close", function () {
	console.log("DB connection successfuly closed");
});

process.on("SIGINT", async () => {
	await conn1.close();
	process.exit(0);
});

module.exports.dbUrl = dbUrl;
module.exports.connection = conn1;
module.exports.app = app;
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
const resourceAllocationRoutes = require("./routes/resourceAllocation");

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Parse application/json
app.use(express.json());

// app.use(express.static("public"))
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(expressSanitizer());
app.use(methodOverride("_method"));

app.locals.moment = require("moment");

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
app.use(resourceAllocationRoutes);

conn1.once("open", () => {
	console.log("Before removing all routers");
	console.log(app._router.stack.length);
	for (let i = 0; i < app._router.stack.length; i++) {
		if (app._router.stack[i].name === "router") {
			app._router.stack.splice(i, 1);
			i--;
		}
	}
	// console.log(app._router.stack);
	console.log("After removing all routers");
	console.log(app._router.stack.length);

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
	app.use(resourceAllocationRoutes);

	console.log("Add back all routers");
	console.log(app._router.stack.length);

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

	const lastItemOfStack = app._router.stack.length - 1;
	const secondLastItemOfStack = app._router.stack.length - 2;

	arraymove(app._router.stack, lastErrHandlingMiddlewareIndex, lastItemOfStack);
	arraymove(app._router.stack, starMiddlewareIndex, secondLastItemOfStack);
});

app.all("*", (req, res, next) => {
	console.log("Resource not found");
	return next(new ExpressError("Page requested does not exist. Check URL and try again", 404));
});

app.all("*", (req, res, next) => {
	console.log("Resource not found");
	return next(new ExpressError("Page requested does not exist. Check URL and try again", 404));
});

const lastMiddlware = (err, req, res, next) => {
	console.log("Error handling middleware at app.js:278");
	const { statusCode = 500 } = err;
	console.log("Last error handling middleware hit");
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

process.on("uncaughtException", error => {
	console.log(error);
});

app.use(lastMiddlware);

app.listen(port, () => console.log(`ReportMe server is running on port ${port}`));
