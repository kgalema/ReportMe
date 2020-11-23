require('dotenv').config();
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const expressSanitizer = require("express-sanitizer")
const methodOverride = require('method-override')
const flash = require("connect-flash")
const path = require("path")
const GridFSStorage = require("multer-gridfs-storage")


const redPanelsRoutes = require("./routes/redPanels")
const sectionsRoutes = require("./routes/sections")
const productionRoutes = require("./routes/production")
const accessRoutes = require("./routes/access")
const rehabilitated = require("./routes/rehabilitated")



// ==================end here====================

// mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
const connection = mongoose.connect("mongodb://localhost/reportMe", {
	useNewUrlParser: true,
	useUnifiedTopology: true
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

app.use(flash())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set("view engine", "ejs")

app.use(expressSanitizer());
app.use(methodOverride("_method"));


app.locals.moment = require("moment");


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