const express = require("express");
const mongoose = require("mongoose");
const { getDate } = require("./date");
const _ = require('lodash');
const { capitalize } = require("lodash");

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// const items = ["Buy food", "Cook food", "Eat food"];
// const workItems = ["Test"];

app.set("view engine", "ejs");

// Database
mongoose.connect("mongodb+srv://admin:Test123@cluster0.zshi7.mongodb.net/todolistDB");

const itemsSchema = new mongoose.Schema ({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name: 'Welcome to your to do list!',
});

const item2 = new Item ({
  name: 'Eat food',
});


const item3 = new Item ({
  name: 'Play videogames',
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


// Routing
app.get("/", function (req, res) {
  const day = getDate();
  const kulPerson = "Kristian";

  Item.find({}, function(err, items) {
    if(items.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        }else {
          console.log('Succesfully added all the items to the database!');
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: day, newListItems: items});   
    }
  });

});

  // Let the user creates their own lists by using parameters
app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, async function(err, foundList) {
    if (!err) {
      if (!foundList) {
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        }); 
        await list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an existing list
        res.render("list", 
        {
          listTitle: foundList.name, 
          newListItems: foundList.items
        });
      }
    }
  });
});


app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  let day = getDate();
  const item = new Item({
    name: itemName
  });
  if (listName === day) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName)
    });
  };
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  const day = getDate();

  if (listName === day) {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
  }
});

// app.get("/work", function (req, res) {
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

app.get('/about', function (req, res) {
  res.render('about'); 
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
