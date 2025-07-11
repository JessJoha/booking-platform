import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path)

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DB_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    LOGIN_SERVICE_PORT = int(os.environ.get('FIND_USER_SERVICE_PORT', 5002))
    ACCESS_TOKEN_EXPIRATION = int(os.environ.get('ACCESS_TOKEN_EXPIRATION', 3600))
    DB_NAME = os.environ.get('DB_NAME')
    