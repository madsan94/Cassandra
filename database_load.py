import pymongo
from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db = client['newproduct']
collection = db['stations']
print(collection)
i=0
a="19.125362"
b="72.999199"
while(i<5):
    station={
    "station_name":"Ghansoli"+str(i),
    "Coordinates_loc":[a,b]
    }
    collection.insert(station)
    a=str(float(a)+5)
    b=str(float(b)-5)
    i+=1
print("ok")
