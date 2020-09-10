const express          = require("express")
const app              = express()
const bodyParser       = require("body-parser")
const mongoose         = require("mongoose")
const expressSanitizer = require("express-sanitizer")
const methodOverride   = require('method-override')
const flash 	       = require("connect-flash")
const multer		   = require("multer");
const path	           = require("path")
const GridFsStorage	   = require("multer-gridfs-storage")


const redPanelsRoutes  = require("./routes/redPanels")
const sectionsRoutes   = require("./routes/sections")
const productionRoutes   = require("./routes/production")
const accessRoutes   = require("./routes/access")







// Uploading files to the locally in the mongodb database
const storage =   multer.diskStorage({
	destination: function (req, file, callback) {
	  callback(null, './uploads');
	},
	filename: function (req, file, callback) {
	  callback(null, Date.now() + file.originalname);
	}
  });
  
  var upload = multer({ storage : storage});

// ==================end here====================

// mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/reportMe", {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.then(()=> console.log("Connected to DB"))
	.catch(error => console.log(error.message));


app.use(flash())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))
app.set("view engine", "ejs")

app.use(expressSanitizer());
app.use(methodOverride("_method"));


app.locals.moment = require("moment");


app.use(redPanelsRoutes)
app.use(sectionsRoutes)
app.use(productionRoutes)
app.use(accessRoutes)


let port = process.env.PORT;
if (port == null || port == "") {
	port = 4000;
  };

app.listen(port, () => console.log(`ReportMe server is running on port ${port}`));