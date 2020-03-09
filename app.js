const dotenv = require('dotenv'); //npm i dotenv -S
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path  = require('path'); //co san của nodejs dung de lay đường dan

dotenv.config();

const userRoute = require("./Routes/User");
// const carRoute = require("./Routes/Car");
const tripRoute = require("./Routes/Trip");
const app = express();

//call body parser
//Chỗ này có thể dùng cả 2 , để parse jon hoặc x-www-form-urlencoded nhé
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, 'images')) ); //express.static la middleware hỗ trọ bởi express
app.use("/docs", express.static(path.join(__dirname, 'docs')) ); 

app.use( (req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
})
app.use("/users", userRoute);
// app.use(carRoute);
app.use("/trips", tripRoute);

mongoose
  .connect(
    // "mongodb+srv://admin:admin@cluster0-ofcjj.mongodb.net/test?retryWrites=true&w=majority",
    "mongodb+srv://admin:admin@xedike-1hoqv.mongodb.net/test",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("--------Connected!-------");
    app.listen(8080);
  });
