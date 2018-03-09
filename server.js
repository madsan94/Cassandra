// server.js
//**************************************//
//App Name: Cassesndra
//Date: 10th March, 2018
//API Server v1.1 Cassendra App
//Owner: Sanket biswas
//Status: Moved to Production

//Live at https://cassendra.herokuapp.com/
//Mongo Database live at  mongodb://sanket:biswas@ds253468.mlab.com:53468/newproduct

//Status: Moved to Production

//**************************************//

const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const dateTime = require('node-datetime');

const session =require('express-session');
const app= express();
var mongoose = require('mongoose');
var URL_DATABASE = process.env.PROD_MONGODB;
//var URL_DATABASE="mongodb://sanket:biswas@ds253468.mlab.com:53468/newproduct"

require('./app/Models/Users');
require('./app/Models/Stations');
require('./app/Models/Vehicle');
require('./app/Models/Booking');
require('./app/Models/Payment');
mongoose.connect(URL_DATABASE);
// Initializing port to listen to HTTP Requests
const port = process.env.PORT || 8000
app.engine('html', require('ejs').renderFile);
//For Session-Management
app.use(session({
  secret: "SessionTesting",
  resave:true,
  saveUninitialized: true
}));
//To read URL encoded for
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
console.log("That is okay")
  require('./app/routes')(app, db);
  app.listen(port,"0.0.0.0",function(){
    console.log('We are live on ' + port);
});
