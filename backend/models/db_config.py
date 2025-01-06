from pymongo import MongoClient

# connection on mongo, port 27017 in docker
client = MongoClient("mongodb://mongo:27017/")
db = client.investment_support_system