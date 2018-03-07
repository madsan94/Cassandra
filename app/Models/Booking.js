//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var Booking = new Schema({
  email:String,
  date:String,

  Booking_ID:{type:String,unique:true},
  station_id:String,
  vehicle_id:String
},{collection:'bookings'});

// Compile model from schema
module.exports  = mongoose.model('Booking', Booking );
