const express = require ("express");
const path = require("path");


const app = express();
app.set("view engine", "ejs");


app.use(express.urlencoded({extended:true}));

app.use("/css", express.static("public/css")); 
// app.use('*/css',express.static('public/css'));

var items =["Buy Food", "Cook Food", "Eat Food"];



app.get("/", function(req, res){
  var today = new Date();

  var options = {
      weekday: "long", 
      day: "numeric",
      month: "long",
      year: "numeric"
  };

  var day = today.toLocaleDateString("en-US", options);
  
  res.render("list", { listTitle: day, newListItems: items });
  
});

app.post("/", function(req, res){
    var item = req.body.newItem;
    items.push(item);
    res.redirect("/");
});


app.listen(3001, function(){
    console.log("Server started on port 3000")
   
    
});
