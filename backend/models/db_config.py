from pymongo import MongoClient

# povezava na mongo, vrata 27017 v Docker
client = MongoClient("mongodb://mongo:27017/")
db = client.investment_support_system