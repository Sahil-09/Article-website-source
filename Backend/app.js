const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path=require("path")
const bodyParser = require("body-parser");
const user=require('./routes/User');
const article=require("./routes/Article")
require('dotenv').config()

app.use(bodyParser.json());

app.use("/image",express.static(path.join(__dirname,"image")))
app.use("/",express.static(path.join(__dirname,"angular")))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,X-Requested-With,Origin,Accept,auth"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,UPDATE,PATCH"
  );
  next();
});

mongoose.connect(process.env.MONGO_DB_URI_D,{ user:process.env.MONGO_USER,pass:process.env.MONGO_PWD,useNewUrlParser: true , useUnifiedTopology: true }).then(() => {
  console.log("Connected successfully!");
})

// mongoose.connect("mongodb+srv://sahil:HTuU7ciTowPk08cs@cluster0.0hdw3.mongodb.net/Articlewebsite?retryWrites=true&w=majority").then(() => {
//   console.log("Connected successfully!");
// })

// HTuU7ciTowPk08cs


app.use('/api/user',user);

app.use('/api/article',article);

app.use((req,res,next)=>{
  res.sendFile(path.join(__dirname,"angular","index.html"))
})
module.exports = app;
