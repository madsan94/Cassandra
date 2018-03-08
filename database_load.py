import pymongo
from pymongo import MongoClient
client = MongoClient('mongodb://sanket:biswas@ds253468.mlab.com:53468/newproduct')
db = client['newproduct']
collection = db['stations']
print(collection)
i=0
lat="19.125362"
lng="72.999199"
while(i<10):
    station={
    "station_name":"Ghansoli"+str(i),
    "longitude":lat,
    "latitude":lng
    }
    collection.insert(station)
    offset = i / 60.0
    lat = str(float(lat) + offset)
    lng = str(float(lng) + offset)
    i+=1
print("ok")
