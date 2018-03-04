var validator = require("email-validator");
var mongoose = require('mongoose');
var Users = require('../Models/Users');
var Stations = require('../Models/Stations');
var Vehicle = require('../Models/Vehicle');
var Booking = require('../Models/Booking');
var Payment = require('../Models/Payment');
var jsonObj = {session: "none",
							 flag: "f",
							 message: "none"};

function refreshJson(){
	jsonObj = {session: "none",
								 flag: "f",
								 message: "none"};
}
module.exports = function(app, db) {
//Signup
app.post('/signup', (req, res) => {
	refreshJson()
    var user_data = {
    a_name: req.body.name,
    a_email: req.body.email,
	  a_password:req.body.password
		};

var user = new Users(user_data);
user.save( function(error, data){
    if(error){
			jsonObj['flag']='f';
			jsonObj['message']="User Already Exists"
        res.send(jsonObj);
			}
	  else{
			sess=req.session
			sess.email=req.body.email
			sess.name=req.body.name
				jsonObj["session"]=sess
				jsonObj['flag']='s'
				jsonObj['message']="User Registered Succesfully"
        res.send(jsonObj)
			}
});
})

// Login-Session homepage
app.post('/login',(req,res)=>{
	refreshJson()
var email_flag=validator.validate(req.body.email);

if(email_flag==true){
Users.find({a_email:req.body.email,a_password:req.body.password}, function(err,user){
		if(err){
		res.json(err);}
		if(user.length==0){
		jsonObj['flag']='f'
		jsonObj["message"]="Invalid Username or Password"
		res.send(jsonObj)
	}
		else{
			sess=req.session;
			sess.name=user[0].a_name;
			sess.email=req.body.email;
			jsonObj['flag']='s';
			jsonObj['message']="Logged In";
			jsonObj['session']=sess;
			res.send(jsonObj);
}
});
}
else{
	jsonObj['flag']='f'
	jsonObj["message"]="Invalid Email Address"
	res.send(jsonObj)
}
});

//Forget password
app.post('/change_password',(req,res)=>{
	refreshJson()
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
else{
jsonObj['flag']='f'
jsonObj["message"]="Session Expired"
	res.send(jsonObj)
}
})

//Code Generator
app.post('/generate_code',(req,res)=>{
	refreshJson()
	sess=req.session;
	if(sess.email){
	var randomstring = require("randomstring");
	var code=randomstring.generate(9);
	jsonObj['flag']='s';
	jsonObj['message']="Code Generated";
	jsonObj['session']=sess;
	jsonObj['code']=code;
	res.send(jsonObj);
}
else{
	jsonObj['flag']='f'
	jsonObj["message"]="Session Expired"
	res.send(jsonObj)
}
})
// Code Generator end

//Add Vehicle
app.post('/add_vehicle',(req,res)=>{
	refreshJson()
	sess=req.session;
	if(sess.email){
		Vehicle.find({email:sess.email,vehicle_number:req.body.vehicle_number},function(err,veh){
		if(err)
			res.json(err)
		 if(veh.length!=0){
			 jsonObj['flag']='f';
		 	jsonObj['message']="Vehicle Already Exists";
		 	jsonObj['session']=sess;

			res.send(jsonObj)}
			else{
				var vehicle_data={email:sess.email,vehicle_number:req.body.vehicle_number,vehicle_type:req.body.vehicle_type};
				var vehicle=new Vehicle(vehicle_data)
				vehicle.save(function(error,data){
					if(error)
					res.json(error);
					else{
						jsonObj['flag']='s';
						jsonObj['message']="Vehicle Added";
						jsonObj['session']=sess;
						jsonObj['vehicle_number']=req.body.vehicle_number
						jsonObj['vehicle_type']=req.body.vehicle_type
						res.json(jsonObj)}
				})
				}
				})
			}
			else{
				jsonObj['flag']='f'
				jsonObj["message"]="Session Expired"
				res.send(jsonObj)
			}
		});

//Vehicle Details
app.post('/show_vehicle',(req,res)=>{
	refreshJson()
	var child={}
	sess=req.session;
	if(sess.email){
		Vehicle.find({email:sess.email},function(err,data){
			if(err)
			res.json(err)
			else{
				jsonObj['session']=sess;
				jsonObj['flag']='s';
				var a=[];

				for(var i=0;i<data.length-1;i++){
				  child["vehicle_number"]=data[i].vehicle_number;
					child["vehicle_type"]=data[i].vehicle_type;
					a.push(child);

				}
				jsonObj["vehicle_details"]=a;

				res.send(jsonObj)
			}
		})
	}
	else{
		jsonObj['flag']='f'
		jsonObj["message"]="Session Expired"
		res.send(jsonObj)
	}
})

}
