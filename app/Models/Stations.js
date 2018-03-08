//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var Stations = new Schema({
    station_name: String,
    longitude:String,
    latitude:String
},{collection:'stations'});

// Compile model from schema
module.exports  = mongoose.model('Stations', Stations );
