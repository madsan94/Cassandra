// server.js
const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const session =require('express-session');
const app= express();
var mongoose = require('mongoose');
var URL_DATABASE = 'mongodb://localhost:27017/newproduct'
require('./app/Models/Users');
require('./app/Models/Stations');
require('./app/Models/Vehicle');
require('./app/Models/Booking');
require('./app/Models/Payment');
mongoose.connect(URL_DATABASE);
// Initializing port to listen to HTTP Requests
const port = 8000;
//For Session-Management
app.use(session({
  secret: "SessionTesting"
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

  require('./app/routes')(app, db);
  app.listen(port, () => {
    console.log('We are live on ' + port);
});
