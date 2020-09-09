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

const Section          = require("./models/section")
const Redpanel         = require("./models/tarp")
const Blast			   = require("./models/blast")
const Clean 		   = require("./models/clean")
const Support  		   = require("./models/support")




const port = process.env.PORT || 4000;

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



// //=======================
// //Deleted redpanel Schema
// //=======================
// const rehabilitatedSchema = new mongoose.Schema({
// 	section: String,
// 	panel: String,
// 	trigger: String,
// 	reportNumber: String,
// 	issueDate: {type: Date},
// 	issuedReport: {},
// 	closedOn: {type: Date, default: Date.now}
// })

// const Rehabilitated = mongoose.model("Rehabilitated", rehabilitatedSchema)


//===========Routes===========

//================
// Sections routes
//================

// 1. Index route -list all sections sections
app.get("/sections", function(req, res){
	Section.find({}, function(err, allSections){
		if(err){
			console.log(err);
		} else {
			res.render("sections/index", {sections : allSections})
		}
	})
})

// 2. New route - renders a for creating new section
app.get("/sections/new", function(req, res){
	res.render("sections/new")
})
// 3. Create route - post a new section into the database then redirect elsewhere
app.post("/sections", function(req, res){
	Section.create(req.body.section, function(err, newSection){
		if(err){
			console.log(err)
			res.render("sections/new")
		} else {
			// then redirect to the index route
			res.redirect("/sections")
		}
	});
})
// 4. Show route - shows/get info about one specific section
app.get("/sections/:id", function(req, res){
	Section.findById(req.params.id).populate("redPanels").exec(function(err, foundSection){
		if(err || !foundSection){
			console.log(err)
			res.redirect("back")
		} else {
			// then redirect to the index route
			res.render("sections/show", {section: foundSection})
		}
	});
})

// 5. Edit route - renders edit form to edit one particular section
app.get("/sections/:id/edit", function(req, res){
	Section.findById(req.params.id, function(err, section){
		if(err){
			res.redirect("back")
		} else {
			res.render("sections/edit", {section: section})
		}
	})
})
// 6. Update route - Puts edited info about one particular section in the database
app.put("/sections/:id", function(req, res){
	Section.findByIdAndUpdate(req.params.id, req.body.section, function(err, updatedSection){
		if(err){
			res.redirect("back")
		} else {
			res.redirect("/sections/" + req.params.id)
		}
	})
})
// 7. Destroy route - Deletes a particular section 
app.delete("/sections/:id", function(req, res){
	Section.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("back")
		} else {
			res.redirect("/sections")
		}
	})
})




//===========================
// Production Reports Routes
//===========================

// 1. Landing Route
app.get("/", function(req, res){
	res.render("welcomePage")
})

// 1. Index route === Shows you all captured reports
app.get("/production", function(req, res){
	Section.find({}, function(err, allSections){
		if(err){
			console.log(err);
		} else {
			res.render("production/index", {sections : allSections})
		}
	})
})

// 2.0 New route - renders new form adding report
app.get("/sections/:id/production/new", function(req, res){
	Section.findById(req.params.id, function(err, foundSection){
		if(err){
			console.log(err);
		} else {
			// console.log(foundSection)
			res.render("production/newBlast", {section: foundSection})
		}
	})
})

// 2.1 New route - renders new form for adding cleaned panels
app.get("/sections/:id/production/newClean", function(req, res){
	Section.findById(req.params.id, function(err, foundSection){
		if(err){
			console.log(err);
		} else {
			// console.log(foundSection)
			res.render("production/newClean", {section: foundSection})
		}
	})
})

// 2.3 New route - renders new form for adding supported panels
app.get("/sections/:id/production/newSupport", function(req, res){
	Section.findById(req.params.id, function(err, foundSection){
		if(err){
			console.log(err);
		} else {
			// console.log(foundSection)
			res.render("production/newSupport", {section: foundSection})
		}
	})
})


// 3.1 Create route - blasted panels
app.post("/sections/:id/production", function(req, res){
	// req.body.blog.body = req.sanitize(req.body.blog.body)
	Section.findById(req.params.id, function(err, section){
		if(err){
			console.log(err)
			res.redirect("/production")
		} else {
			// create new blasted panel
			Blast.create(req.body.blast, function(err, blasted){
				if(err){
					console.log(err)
				} else{
					//add section name and id to blasted panel
					// console.log(blasted)
					blasted.forEach(function(b){
						b.section.id = section._id;
						b.section.name = section.name;
					})
					// console.log(blasted)
					//save an array of blasted panels
					blasted.forEach(function(e){
						e.save()
					})
					
					
					// console.log(blasted)

					blasted.forEach(function(e){
						section.blastedPanels.push(e)
					})
					// section.blastedPanels.push(blasted)
					// connect new blasted panel to section
					section.save()
					// console.log(section)
					//redirect to sections show page
					res.render("production/newClean", {section:section})
				}
			})
		}
	})
})



// 3.2 Create route - cleaned panels
app.post("/sections/:id/production/clean", function(req, res){
	// req.body.blog.body = req.sanitize(req.body.blog.body)
	Section.findById(req.params.id, function(err, section){
		if(err){
			console.log(err)
			res.redirect("/production")
		} else {
			// create new cleaned panel
			Clean.create(req.body.clean, function(err, cleaned){
				if(err){
					console.log(err)
				} else{
					//add section name and id to cleaned panel
					cleaned.forEach(function(b){
						b.section.id = section._id;
						b.section.name = section.name;
					})

					//save an array of cleaned panels
					cleaned.forEach(function(e){
						e.save()
					})
					
					//associated cleaned panels with a section
					cleaned.forEach(function(e){
						section.cleanedPanels.push(e)
					})
					// save section
					section.save()
					
					//redirect to next
					res.render("production/newSupport", {section:section})
				}
			})
		}
	})
	
})

// 3.3 Create route - supported panels
app.post("/sections/:id/production/support", function(req, res){
	// req.body.blog.body = req.sanitize(req.body.blog.body)
	Section.findById(req.params.id, function(err, section){
		if(err){
			console.log(err)
			res.redirect("/production")
		} else {
			// create new supported panel
			Support.create(req.body.support, function(err, supported){
				if(err){
					console.log(err)
				} else{
					//add section name and id to supported panel
					supported.forEach(function(b){
						b.section.id = section._id;
						b.section.name = section.name;
					})

					//save an array of supported panels
					supported.forEach(function(e){
						e.save()
					})
					
					//associated supported panels with a section
					supported.forEach(function(e){
						section.supportedPanels.push(e)
					})
					// save section
					section.save()
					
					//redirect to sections show page
					res.redirect("/production")
				}
			})
		}
	})
	
})


// 4. Show route - shows info about 1 specific reported section within a new form
app.get("/sections/:id/production/show", function(req, res){
	Section.findById(req.params.id).populate("blastedPanels").exec(function(err, foundSection){
		if(err){
			console.log(err)
		} else {
	// then redirect to the index route
			res.render("production/showProduction", {reported: foundSection})
		}
	});
})

// 5. Edit - shows an edit form form
// 6. Update - takes info from edit form and PUTs it into existing data

// 7. Destroy - delete one specific production panel
app.delete("/sections/:id/production/:id", function(req, res){

})


//======================
//TARP Red panels routes
//======================

// 1. Index routes -renders a list for all red panels
app.get("/redPanel", function(req, res){
	// res.render("redPanels/index")
	Redpanel.find({}, function(err, redpanels){
		if(err){
			console.log(err);
		} else {
			res.render("redPanels/index", {redpanels: redpanels})
		}
	})
})

// 2. New Route - renders a form for red panels
app.get("/sections/:id/redPanel/new", function(req, res){
	Section.findById(req.params.id, function(err, foundSection){
		if(err){
			console.log(err);
		} else {
			res.render("redPanels/new", {section: foundSection})
		}
	})
})

// 3. Create route - creates a tarp red panel data
app.post("/sections/:id/redPanels", function(req, res){
	// lookup section using ID
	Section.findById(req.params.id, function(err, section){
		if(err){
			console.log(err)
			res.redirect("/sections")
		} else {
			// create new redPanel
			Redpanel.create(req.body.redPanel, function(err, redpanel){
				if(err){
					console.log(err)
				} else{
					//add section and section id to repanel
					redpanel.section.id = section._id
					redpanel.section.name = section.name
					//save redpanel
					redpanel.save()
					section.redPanels.push(redpanel)
					section.save()
					// console.log(section)
					//redirect to sections show page
					res.redirect("/sections/" + section._id)
				}
			})
		}
	})
	
})

// 4. Show route - shows info about one specific redpanel
app.get("/redPanel/:id", function(req, res){
	// res.render("redPanels/show")
	Redpanel.findById(req.params.id, function(err, foundRedPanel){
		if(err || !foundRedPanel){
			console.log(err)
			res.redirect("back")
		} else {
			res.render("redPanels/show", {redPanel: foundRedPanel})
		}
	});
})

// 5. Edit route - Edit a specific redpanel (Renders a form)
app.get("/sections/:id/redPanels/:redpanel_id/edit", function(req, res){
	Redpanel.findById(req.params.redpanel_id, function(err, foundRed){
		if(err){
			res.redirect("back")
		} else {
			res.render("redPanels/edit", {section_id: req.params.id, redpanel: foundRed})
		}
	})
})

// 6. Update route - Puts the supplied info from edit form into the database
app.put("/sections/:id/redPanels/:redpanel_id", function(req, res){
	Redpanel.findByIdAndUpdate(req.params.redpanel_id, req.body.redPanel, function(err, updatedRedpanel){
		if(err){
			res.redirect("back")
		} else {
			res.redirect("/redPanel/" + req.params.redpanel_id)
		}
	})
})
// 7. Delete route - Delete particular red panel
app.delete("/sections/:id/redPanels/:redpanel_id", function(req, res){
	Redpanel.findByIdAndRemove(req.params.redpanel_id, function(err){
		if(err){
			res.redirect("back")
		} else {
			res.redirect("/redPanel")
		}
	})
})



//=============================================
// User authentication and authorisation routes
//=============================================

// REGISTER ROUTES

// LOG IN ROUTES
app.get("/login", function(req, res){
	res.render("login")
})

app.get("/register", function(req, res){
	res.render("register")
})




app.listen(port, () => console.log(`ReportMe server is running on port ${port}`))