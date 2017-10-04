var express = require("express"),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	expressSantizer = require("express-sanitizer"),
	moment = require("moment"),
	tz = require("moment-timezone"),
	app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(expressSantizer());
app.use(methodOverride("_method"));


var url = process.env.DATABASEURL || "mongodb://localhost/BlogApp";

mongoose.connect(url, {
	useMongoClient: true
});

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {
		type: Date,
		default: Date.now
	}
});

var Blog = mongoose.model("Blog", blogSchema);

Blog.create({
	title: "Swati-and-me",
	image: "https://images.unsplash.com/photo-1500412830877-c77d92c33203?dpr=1&auto=compress,format&fit=crop&w=750&h=&q=80&cs=tinysrgb&crop=",
	body: "Let this be the hour in which you are compelled to examine the influx of burgeoning thoughts,despite resistance.<br><br>Let this be the hour in which you strip yourself naked of all masks donned for survival in this superficial society.<br><br>Let this be the hour in which your emotional prowess can let down its guard, without fear of being compromised.<br><br>Let this be the hour in which you are liberated from the compulsion of ostentatiousness.<br><br>Let this be the hour in which obscurity is a comfort, and popularity, an unwelcome imposition.<br><br>Let this be the hour in which you’re free to express, without regard for unsolicited comment.<br><br>Let this be the hour in which you can indulge in forbidden fantasies, away from carping eyes.<br><br>Let this be the hour in which you are forced to acknowledge,	not the good, but the dark side of your existence.<br><br>And above all, let this be the hour in which you can make peace with yourself."
	
});


app.get("/", function (req, res) {
	res.redirect("/blogs");
});

//index route
app.get("/blogs", function (req, res) {
	Blog.find({}, function (err, blogs) {
		if (err)
			res.redirect("/blogs")

		else {
			res.render("index", {
				blogs: blogs,
				moment: moment,
				tz: tz
			});
		}
	});
});

//new route
app.get("/blogs/new", function (req, res) {
	res.render("new");
});

//create route
app.post("/blogs", function (req, res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function (err, newblog) {
		if (err)
			console.log(err);

		else
			res.redirect("/blogs");
	});
});

//show route
app.get("/blogs/:id", function (req, res) {
	var id = req.params.id;
	Blog.findById(id, function (err, blog) {
		if (err) {
			console.log(err);
		} else {
			res.render("show", {
				blog: blog,
				moment: moment,
				tz: tz
			});
		}
	});

});

//edit route
app.get("/blogs/:id/edit", function (req, res) {
	Blog.findById(req.params.id, function (err, foundBlog) {
		if (err)
			res.redirect("/blogs");

		else {
			res.render("edit", {
				blog: foundBlog
			});
		}
	});

});


//update route
app.put("/blogs/:id", function (req, res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updated) {
		if (err) {
			res.redirect("/blogs");

		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	})
});

//show route
app.delete("/blogs/:id", function (req, res) {
	Blog.findByIdAndRemove(req.params.id, function (err) {
		if (err)
			res.redirect("/blogs");

		else {
			res.redirect("/blogs");
		}
	});
});
app.listen(process.env.PORT, process.env.IP);

