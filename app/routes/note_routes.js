var validator = require("email-validator");
var fs = require("fs");
var mongoose = require('mongoose');
var Users = require('../Models/Users');
var Stations = require('../Models/Stations');
var Vehicle = require('../Models/Vehicle');
var Booking = require('../Models/Booking');
var Payment = require('../Models/Payment');
var dateTime = require('node-datetime');
var check_vehicle='s'
var jsonObj = {session: "none",
							 flag: "f",
							 message: "none"};

function refreshJson(){
	jsonObj = {session: "none",
								 flag: "f",
								 message: "none"};
}
function addVehicle(){
	check_vehicle='f'
}

module.exports = function(app, db) {
app.get('/', (req, res)=> {
	console.log(res.status)
		res.render('index.html');
	});
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
			var sess=req.session
			sess.email=req.body.email
			sess.name=req.body.name
				console.log("ok")
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
	jsonObj["check_vehicle"]='f'
console.log(req.body.email)
var email_flag=validator.validate(req.body.email);
var sess=req.session;
sess.email=req.body.email
console.log(sess.email)
if(email_flag==true){
console.log("ok")
Users.find({a_email:sess.email,a_password:req.body.password}, function(err,user){
		if(err){
		res.json(err);}
		if(user.length==0){
			console.log(user)
		jsonObj['flag']='f'
		jsonObj["message"]="Invalid Username or Password"

		res.send(jsonObj)
	}
		else{



			Vehicle.find({email:sess.email},function(err,data){
				if(err){
					res.json(err)
				}
				else{
					if(data.length==0)
					{
						console.log("all right")
						sess.name=user[0].a_name;
						sess.email=user[0].a_email;
						jsonObj['flag']='s';
						jsonObj['message']="Logged In";
						jsonObj['session']=sess;
						jsonObj['check_vehicle']='f';
						res.send(jsonObj);


					}
					else{
						sess.name=user[0].a_name;
						sess.email=user[0].a_email;
						jsonObj['flag']='s';
						jsonObj['message']="Logged In";
						jsonObj['session']=sess;
						jsonObj['check_vehicle']='s';
						res.send(jsonObj);
						console.log("yeah");
					}
				}
			})

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
	sess=req.body.session
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
app.post('/booking',(req,res)=>{
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
if(dd<10) {
    dd = '0'+dd
}
if(mm<10) {
    mm = '0'+mm
}

today = dd + '/' + mm + '/' + yyyy;

	refreshJson()
	var dt = dateTime.create();
	console.log(dt.now())
	sess=req.body.session
	if(sess.email){
		var user_data={
			amount:req.body.amount,
			email:sess.email,
			date:today,
			station_id:req.body.station_id,
			vehicle_number:req.body.vehicle_number
		}
		Stations.find({_id:req.body.station_id},function(err,station){
				 if(err)

				 res.json(err)
				 else{
					 user_data["station_name"]=station[0].station_name
					 user_data['latitude']=station[0].latitude
					 user_data['longitude']=station[0].longitude
					 var booking = new Booking(user_data);
					 booking.save( function(error, data){
						 if(error){
							 	 jsonObj['flag']='f';
								 jsonObj['message']="Booking cannot be taken"
								 res.json(error);
								 }
							 else{

									 jsonObj["session"]=sess
									 jsonObj['flag']='s'
									 jsonObj['Booking_ID']=data._id
									 jsonObj['message']="Booking Succesfull"
									 res.send(jsonObj)
								 }

			 })
}
})
}

})
// Code Generator end
// Show Bookings:
app.post('/show_booking',(req,res)=>{
	refreshJson()
	sess=req.body.session;
	var child={station_name:"",
							vehicle_number:""
							}
	if(sess.email){
		Booking.find({email:sess.email},function(err,data){
			if(err)
			res.json(err)
			else{
				console.log("Booking Found")
				jsonObj['session']=sess;
				jsonObj['flag']='s';
				var a=[];

				for(var i=0;i<data.length;i++){
					child["station_name"]=data[i].station_name
					child["vehicle_number"]=data[i].vehicle_number
					child["date"]=data[i].date
					child["amount"]=data[i].amount
					child["Booking_ID"]=data[i]._id

					a.push(child);
					child={}
				console.log(a)
				}
				console.log(a)
				jsonObj["booking_details"]=a;
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


//Add Vehicle
app.post('/add_vehicle',(req,res)=>{
	refreshJson()
	sess=req.body.session;
	if(sess.email){

		Vehicle.find({email:sess.email,vehicle_number:req.body.vehicle_number},function(err,veh){
		if(err)
			res.json(err)
		 if(veh.length!=0){
			 console.log(veh)
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

	sess=req.body.session;
	console.log(sess.email)
	if(sess.email){
		Vehicle.find({email:sess.email},function(err,data){
			if(err)
			res.json(err)
			else{
				jsonObj['session']=sess;
				jsonObj['flag']='s';
				var a=[];

				for(var i=0;i<data.length;i++){
					var child={}
				  child["vehicle_number"]=data[i].vehicle_number;
					child["vehicle_type"]=data[i].vehicle_type;
					a.push(child);
					console.log(data[i])
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
app.post('/stations',(req,res)=>{
	console.log("okman")
	refreshJson()
	var child={}
	Stations.find(function(err,data){var a={}
	if(err)
	res.json(err)
	else{
		var a=[]
		jsonObj["flag"]='s'
		jsonObj["message"]='Stations '+data.length

		for(var i=0;i<data.length;i++)
		{

				child['station_name']=data[i].station_name;
				child['latitude']=data[i].latitude;
				child['longitude']=data[i].longitude;
				child['station_id']=data[i]._id;
			a.push(child)
			child={}

	}

jsonObj["stations"]=a;
a={};
res.send(jsonObj);
}
	})
})

//Current Booking
app.post('/currentbooking',(req,res)=>{
	refreshJson()
	sess=req.body.session
	if(sess.email)
	{
	Booking.find({Booking_ID:req.booking_id},function(err,data){
		if(err)
		res.json(err)
		else{
			jsonObj["station_name"]=data[0].station_name
			jsonObj["vehicle_number"]=data[0].vehicle_number
			jsonObj["date"]=data[0].date
			jsonObj["amount"]=data[0].amount
			jsonObj["Booking_ID"]=data[0]._id
			jsonObj["latitude"]=data[0].latitude;
			jsonObj["longitude"]=data[0].longitude
			jsonObj["session"]=sess
			jsonObj["flag"]='s'
			jsonObj["message"]="Current Location..."
			console.log(data[0].longitude)
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

//Payment Route
app.post('/payment',(req,res)=>{
	sess=req.body.session
	refreshJson
	payment_details={}
	if(sess.email){
		payment["email"]=sess.email
		payment["card_number"]=req.body.card_details
		payment["Amount"]=req.body.amount
		payment["expiry"]=req.body.expiry
		payment["cvv"]=req.body.cvv
		var payment = new Payment(payment_details);
	payment.save(function(error,data){
		if(error)
		res.json(error)
		else{
			jsonObj["flag"]='s'
			jsonObj["message"]="Payment Succesfull"
			res.send(jsonObj)

		}
	})

}
else{
	jsonObj[flag]='f'
	jsonObj[message]="Session Expired"
	res.send(jsonObj)
}
})
}
