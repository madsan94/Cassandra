//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var Booking = new Schema({
  email:String,
  date:String,
  amount:String,
  station_id:String,
  vehicle_number:String,
  station_name:String
},{collection:'bookings'});

// Compile model from schema
module.exports  = mongoose.model('Booking', Booking );
