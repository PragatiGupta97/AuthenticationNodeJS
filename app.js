//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrpyt = require('mongoose-encryption')
const md5 = require('md5')
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb://admin:password@localhost:27017/UserDB?authSource=admin"
);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

//console.log(process.env.API_key)
//userSchema.plugin(encrpyt, {secret:secret})
//userSchema.plugin(encrpyt, {secret:process.env.Secret, encryptedFields: ['password']});
const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  User.findOne(
    { email: req.body.username},
    function (err, foundUser) {
      if (!err && (foundUser.password == md5(req.body.password))) {
        res.render("secrets");
      } else {
        console.log(err);
      }
    }
  );
});
app.get("/register", function (req, res) {
  res.render("register");
});
app.post("/register", function (req, res) {
  const newUSer = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });
  newUSer.save(function (err) {
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});

app.listen(3000, function () {
  console.log("listening to port 3000");
});
