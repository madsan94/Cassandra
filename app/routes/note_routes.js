
var mongoose = require('mongoose');
var Users = require('../Models/Users');
var Stations = require('../Models/Stations');
var Vehicle = require('../Models/Vehicle');
var Booking = require('../Models/Booking');
var Payment = require('../Models/Payment');
module.exports = function(app, db) {
//Signup
app.post('/signup', (req, res) => {
    var user_data = {
    a_name: req.body.name,
    a_email: req.body.email,
	  a_password:req.body.password
};
var user = new Users(user_data);
user.save( function(error, data){
    if(error)
        res.json(error);
	  else
        res.json(data);
});
})

// Login-Session homepage
app.post('/login',(req,res)=>{
Users.find({a_email:req.body.email,a_password:req.body.password}, function(err,user){
		if(err){
		res.json(err);}
		if(user.length==0)
		res.send("User Doesn't Exists")
		else{
			sess=req.session;
			sess.name=user[0].a_name;
			sess.email=req.body.email;
			res.send("Hello"+sess.name);
}
});
});

//Forget password
app.post('/change_password',(req,res)=>{
	sess=req.session
	if(sess.email){
	var change={ $set: { a_password:req.body.password } };
	Users.update({a_email:sess.email},change, function(err, data) {
if(err)
res.jsos(err)
else
	res.json(data)
})
}
else
	res.send("Session Expired")
})

//Code Generator
app.post('/generate_code',(req,res)=>{
	sess=req.session;
	if(sess.email){
	var randomstring = require("randomstring");
	var code=randomstring.generate();
	res.send(code);
}
else{
	res.send("Session Expired")
}
})
// Code Generator end

//Add Vehicle
app.post('/add_vehicle',(req,res)=>{
	sess=req.session;
	if(sess.email){
		Vehicle.find({email:sess.email,vehicle_number:req.body.vehicle_number},function(err,veh){
		if(err)
			res.json(err)
		 if(veh.length!=0)
			res.send("Vehicle already exists")
			else{
				var vehicle_data={email:sess.email,vehicle_number:req.body.vehicle_number,vehicle_type:req.body.vehicle_type};
				var vehicle=new Vehicle(vehicle_data)
				vehicle.save(function(error,data){
					if(error)
					res.json(error);
					else
					res.json(data)
				})
				}
				})
			}
			else{
				res.send("Session Expired")
			}
		});

//Vehicle Details
app.post('/show_vehicle',(req,res)=>{
	sess=req.session;
	if(sess.email){
		Vehicle.find({email:sess.email},function(err,data){
			if(err)
			res.json(err)
			else{
				res.json(data)
			}
		})
	}
})

}
