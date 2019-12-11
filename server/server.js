const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
const VM = express();
VM.use(bodyParser.json());
VM.use(bodyParser.urlencoded({
  extended: false
}));
VM.use(express.static('public'));

var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var server = http.Server(app);
var io = socketIO(server);

app.use(express.static('../public'));
const mongoose = require('mongoose');


const cookieParser = require("cookie-parser");
app.use(cookieParser());

const tickets = require("./tickets.js");
app.use("/api/tickets", tickets);
const users = require("./users.js");
app.use("/api/users", users);



//app.use(express.static('public'));

// connect to the database
mongoose.connect('mongodb://localhost:27017/LE', {
  useNewUrlParser: true
});

const itemSchema = new mongoose.Schema({
  name: String,
  maker: String,
  path: String,
  difficulty: Number,
  buyNow: Boolean,
  buys: Number,
  description: [String],
});
const Item = mongoose.model('Item', itemSchema);

app.post('/api/items', async (req, res) => {
  const item = new Item({
    name: req.body.name,
    maker: req.body.maker,
    difficulty: req.body.difficulty,
    buys: req.body.buys,
    buyNow: req.body.buyNow,
    description: req.body.description,
  });
  try {
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
app.get('/api/items/:id', async(req,res)=>{
  try {
    var id = req.params.id;
    console.log(id);
    var query = { _id: id };
    let level = Item.findOne(query,function(){});
    res.send(level);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
app.get('/api/items/m/:maker', async(req,res)=>{
  try {
    var id = req.params.maker;
    console.log(id);
    var query = { maker: id };
    let level = Item.findOne(query,function(){});
    res.send(level);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
app.get('/api/items', async (req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
app.delete('/api/items/:id', async(req,res)=>{
  try {
    var id = req.params.id;
    console.log(id);
    var query = { _id: id };
    Item.deleteOne(query,function(){}); /*function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });*/
  } catch (error) {
    console.log(error);
  }
});
app.put('/api/items/:id', async (req, res) => {
  try {
    var id = req.params.id;
    var query = { _id: id };
    var update = { $set: {buys: req.body.buys, buyNow: req.body.buyNow}};
    let item = await Item.updateOne(query, update, function(){});
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});/*
app.put('/api/items/:id', async (req, res) => {
  try {
    console.log(req.body.name);
    var id = req.params.id;
    var query = { _id: id };
    var update = { $set: {name: req.body.name , difficulty: req.body.difficulty }};
    let item = await Item.updateOne(query, update, function(){});
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});*/
app.listen(3000, () => console.log('Server listening on port 3000!'));