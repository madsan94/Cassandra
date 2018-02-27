const noteRoutes = require('./note_routes');
 var Users = require('../Models/Users');
 var Users = require('../Models/Stations');
 var Users = require('../Models/Vehicle');
 var Users = require('../Models/Booking');
 var Users = require('../Models/Payment');

module.exports = function(app, db) {
  noteRoutes(app, db);
  // Other route groups could go here, in the future
};
