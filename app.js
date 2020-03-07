const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

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

Blog.create({
    title: "Test blog",
    image: "https://image.shutterstock.com/image-photo/beautiful-water-drop-on-dandelion-260nw-789676552.jpg",
    body: "This is a test blog",
})

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
    Blog.create(req.body.blog, function(err, blog){
        if(err){
            res.render("new")
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