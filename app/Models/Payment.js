//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var Payment = new Schema({
  email:String,
  Reference_ID:String,
  Amount:String

});

// Compile model from schema
module.exports  = mongoose.model('Payment', Payment );
