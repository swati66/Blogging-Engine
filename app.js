var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride= require("method-override"),
    expressSantizer= require("express-sanitizer"),
    app = express();
    
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSantizer());
app.use(methodOverride("_method"));

var url = process.env.DATABASEURL || "mongodb://localhost/BlogApp"
mongoose.connect(url);

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Rainy Blues",
//     image: "https://www.bou-lderdowntown.com/_files/images/3691825088_1c420bb71c.jpg",
//     body: "Monsoon has finally kicked in. And so has all its moods!"
// });


app.get("/", function(req, res){
    res.redirect("/blogs");
});

//index route
app.get("/blogs", function(req, res){
   Blog.find({}, function(err, blogs){
      if(err)
      res.redirect("/blogs")
      
      else{
          res.render("index", {blogs: blogs});
      }
   });
});

//new route
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//create route
app.post("/blogs", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newblog){
        if(err)
        console.log(err);
        
        else
        res.redirect("/blogs");
    });
});

//show route
app.get("/blogs/:id", function(req, res){
   var id = req.params.id;
   Blog.findById(id, function(err, blog){
       if(err){
           console.log(err);
       } else {
           res.render("show", {blog: blog});
       }
   });
   
});

//edit route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err)
        res.redirect("/blogs");
        
        else{
        res.render("edit", {blog: foundBlog});
        }
    });
    
});


//update route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updated){
        if(err){
            res.redirect("/blogs");
            
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

//show route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err)
        res.redirect("/blogs");
        
        else{
            res.redirect("/blogs");
        }
    });
});
app.listen(process.env.PORT, process.env.IP);