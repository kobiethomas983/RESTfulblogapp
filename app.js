var express             = require("express"),
    app                 = express(),
    mongoose            = require("mongoose"),
    methodOveride       = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    bodyParser          = require("body-parser"),
    portNumber          = 2000;
//App config
mongoose.connect('mongodb://localhost:27017/blog_app', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
//this is for the css styling
app.use(express.static("public"));
app.use(methodOveride("_method"));
app.set("view engine", "ejs");
//Mongoose/Model Config
var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    description: String,
    created: {type:Date, default: Date.now}
});
var Blog = mongoose.model("blog", blogSchema);

//Restful routes
app.get("/", function(req, res) {
    res.redirect("/blogs");
});
app.get("/blogs", function(req, res){

  Blog.find({}, function(error,blogs){
       if(error){
           console.log("Something went wrong inside of find");
           console.log(error);
       }else{
           res.render("index", {blogs: blogs});
       }
   });

});
//NEW ROUTE
app.get("/blogs/new", function(req, res) {
   res.render("new");
});
//CREATE ROUTE
app.post("/blogs",function(req,res){
    //so user can't run code in form
    //req.body.blogs.body = expressSanitizer(req.body.blogs.body);
    //create blog
    Blog.create(req.body.blogs, function(error,newBlog){
        if(error){
            console.log("something went wrong");
            console.log(error);
        }else{
             //then render to the index
            res.redirect("/blogs");
        }
    });

});

//SHOW ROUTE
app.get("/blogs/:id", function(req,res){
    //need to find the id in the data base
    //base in object to operate with
    Blog.findById(req.params.id, function(error,foundBlog){
        if(error){
            //if there is an error redirect them to blog page
            res.redirect("/blogs");
        }else{
            res.render("show", {blog:foundBlog});
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){

    //so user can't run code in form
    req.body.description = expressSanitizer(req.body.description);
     //find id to update
    Blog.findById(req.params.id, function(error,foundBlog){
       if(error){
           res.redirect("/blogs");
       }else{
              //need a function once found data to edit
           res.render("edit", {blog:foundBlog});
       }
    });


});
app.put("/blogs/:id", function(req,res){
    //use findByIdandUpdate function to change data and find id
    //findByIdAndUpdate(id, update, callback
    //use body when you are taking info from a html file/form
    Blog.findByIdAndUpdate(req.params.id, req.body.blogs, function(error,updatedBlog){
        if(error){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }
    });

})
//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){

   //find id user whats to delete
   //use params when you are trying to find something from the path
   //since we are removing we only need to pass in error
   Blog.findByIdAndRemove(req.params.id, function(error){
       if(error){
           res.redirect("/blogs");
       }else{
           res.redirect("/blogs");
       }
   });
});

app.listen(portNumber,function(){
    console.log("server has started on localhost:2000...");
});
