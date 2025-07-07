import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DOCDB_URI = os.getenv("DOCDB_URI")
    DOCDB_DATABASE = os.getenv("DOCDB_DATABASE", "porfilesDB")
    JWT_SECRET = os.getenv("JWT_SECRET")
    UPDATE_PROFILE_SERVICE_PORT = int(os.getenv("UPDATE_PROFILE_SERVICE_PORT", 5008))
    JWT_EXPIRATION = int(os.getenv("JWT_EXPIRATION", 3600))