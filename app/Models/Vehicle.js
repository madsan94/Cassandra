//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var Vehicle = new Schema({
  email:String,
  vehicle_number:{type:String,unique:true},
  vehicle_type:String
},{collection:'vehicles'});

// Compile model from schema
module.exports  = mongoose.model('Vehicle', Vehicle );
