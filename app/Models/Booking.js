//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var Booking = new Schema({
  email:String,
  date:Date,
  time:String,
  Reference_ID:String,
  Booking_ID:{type:String,unique:true}

});

// Compile model from schema
module.exports  = mongoose.model('Booking', Booking );
