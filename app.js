const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const expressSanitizer = require("express-sanitizer")

mongoose.connect("mongodb://localhost/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connection to the database is established!");
}).catch((err) => {
    console.log("Database error!");
    console.log(err);
})
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSanitizer())
app.use(methodOverride("_method"))

const blogSchema = new mongoose.Schema({
    title: String,
    image: {
        type: String,
        default: "placeholder.png"
    },
    body: String,
    created: {
        type: Date,
        default: Date.now,
    },
})

const Blog = mongoose.model("Blog", blogSchema)

app.get("/", function(req, res){
    res.redirect("/blogs")
})

// INDEX
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if (err) {
            console.log(err)
        } else {
            res.render("index", {blogs: blogs})
        }
    })
    
})

// NEW
app.get("/blogs/new", function(req, res){
    res.render("new")
})

// CREATE
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, function(err, blog){
        if(err){
            res.render("new")
        } else {
            res.redirect("/blogs")
        }
    })
})

// SHOW
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err)
            res.redirect("/blogs")
        } else {
            res.render("show", {blog: blog})
        }
    })
})

// EDIT
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if (err) {
            res.redirect("/blogs")
        } else {
            res.render("edit", {blog: blog})
        }
    })
})

// UPDATE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err){
        if (err) {
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs/" + req.params.id)
        }
    })
})

// DESTROY
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndDelete(req.params.id, function(err){
        if (err) {
            console.log(err)
        } else {
            res.redirect("/blogs")
        }
    })
})

app.listen(3001, function(err){
    if (err) {
        console.log(err);
    } else {
        console.log("Server is listening on port 3001");
    }
})