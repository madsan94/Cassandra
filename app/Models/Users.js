//Require Mongoose

var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var Users = new Schema({
    a_name: String,
    a_email: {type:String,unique:true},
    a_password: String
},{collection:'users'});

// Compile model from schema
module.exports  = mongoose.model('Users', Users);
