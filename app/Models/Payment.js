//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var Payment = new Schema({
  email:String,
  card_number:String,
  expiry:String,
  Amount:String,
  cvv:String

});

// Compile model from schema
module.exports  = mongoose.model('Payment', Payment );
