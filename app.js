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

app.listen(3001, function(err){
    if (err) {
        console.log(err);
    } else {
        console.log("Server is listening on port 3001");
    }
})