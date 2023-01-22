require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');
const getDate = require('./date.js');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

const date= getDate.date();
const day = getDate.day();

const uri = "mongodb+srv://admin-ayush:" + process.env.password + "@cluster0.4d2gkcj.mongodb.net/todoListDB";

mongoose.set('strictQuery', false);
mongoose.connect(uri, { useNewUrlParser: true });

//Schema for homepage
const itemsListSchema = new mongoose.Schema({
  name: String,
  value: Boolean
});

//Schema for dynamic routes
const listSchema = new mongoose.Schema({
  listName: String,
  list: [itemsListSchema]
});

//model for homepage
const itemsList = mongoose.model('Item', itemsListSchema);

//model for dynamic routes
const list = mongoose.model('List', listSchema);

const item1 = new itemsList({
  name: "Welcome to your todolist",
  value: false
});

const item2 = new itemsList({
  name: "Hit the + button to add a new item.",
  value: false
});

const item3 = new itemsList({
  name: "Hit this to delete an item. -->",
  value: false
});

const items = [item1, item2, item3];





// design file
app.use(express.static("public"));
app.set("view engine", "ejs");

// routers
app.get("/", (req, res) => {
  itemsList.find({}, (err, docs) => {
    if (err){
      console.log(err);
    }else{
      if (docs.length === 0){
        itemsList.insertMany(items, (err) => {
          if (err){
            console.log("Error ocurred while entering default list items in database!");
          }else{
            console.log("Default items added successfully to database.");
            res.redirect("/");
          }
        });
      }else{
        res.render("index",{itemsList:docs, heading: date});
      }
    }
  });

});

app.get("/:customListName", (req, res) => {
  const listName = _.capitalize(req.params.customListName);
  list.find({listName: listName}, (err, docs) => {
    if (err){
      console.log(err);
    }else{
      if (docs.length === 0){
        const item = new list({
          listName: listName,
          list: items
        });
        item.save();
        res.redirect("/" + listName);
      }else{
        res.render("index",{itemsList:docs[0].list, heading: listName});
      }
    }
  })
  
  
});

app.post("/", (req, res) => {
    const newItem = req.body.newItem; 
    const heading = req.body.button;
    const item = new itemsList({
      name: newItem,
      value: false
    });
    if (heading === day+","){
      item.save();
      res.redirect("/");
    }else{
      list.find({listName: heading}, (err, docs) => {
        if (err){
          console.log(err);
        }else{
          docs[0].list.push(item);
          docs[0].save();
          res.redirect("/" + heading);
        }
      });
    }
});

app.post("/delete", (req, res) => {
  const itemID = req.body.delete;
  const heading = req.body.heading;
  if (heading === day+","){
    itemsList.findByIdAndRemove(itemID, (err) => {
      if (err){
        console.log(err);
      }else{
        res.redirect("/");
      }
    });
  }else{
    list.findOneAndUpdate({listName: heading}, { $pull: { list: { _id: itemID}} }, (err) => {
      if (err){
        console.log(err);
      }else{
        res.redirect("/" + heading);
      }
    });
  }
});

app.post("/checked", (req, res) => {
  const heading = req.body.heading;
  const itemID = req.body.checkbox;

  if (heading === day+","){
    itemsList.findByIdAndUpdate(itemID, {value: true}, (err) => {
      if (err){
        console.log(err);
      }else{
        res.redirect("/");
      }
    });
  }else{
    list.find({listName: heading}, (err, docs) => {
      if (err){
        console.log(err);
      }else{
        // docs[0].list.push(item);
        docs[0].list.forEach(element => {
          if (element._id == itemID){
            element.value = true;
          }
        });
        docs[0].save();
        res.redirect("/" + heading);
      }
    });
  }
});

// server listening
app.listen(PORT, () => {
  console.log(`The app start on http://localhost:${PORT}`);
});
