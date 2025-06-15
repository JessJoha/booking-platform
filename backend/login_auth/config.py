import os

class Config:
    
    JWT_SECRET_KEY = os.getenv('JWT_SECRET')
    SQLALCHEMY_DATABASE_URI = os.getenv('DB_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY')
    LOGIN_SERVICE_PORT = int(os.getenv('LOGIN_SERVICE_PORT', 5000))
    ACCESS_TOKEN_EXPIRATION = int(os.getenv('ACCESS_TOKEN_EXPIRATION', 3600))
    
    
