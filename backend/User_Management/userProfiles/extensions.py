from pymongo import MongoClient
from config import Config

client = MongoClient(Config.DOCDB_URI) 
db = client[Config.DOCDB_DATABASE]
collection = db['user_profiles']
