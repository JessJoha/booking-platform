import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DOCDB_URI = os.getenv("DOCDB_URI")  
    DOCDB_DATABASE = os.getenv("DOCDB_DATABASE", "UserProfileDB")
    JWT_SECRET = os.getenv("JWT_SECRET")
    PROFILE_SERVICE_PORT = int(os.getenv("PROFILE_SERVICE_PORT", 5003))
