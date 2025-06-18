import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DB_URL') 
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    RECOVERY_SERVICE_PORT = int(os.getenv('RECOVERY_SERVICE_PORT', 5002))
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'info')
    ACCESS_TOKEN_EXPIRATION = int(os.environ.get('ACCESS_TOKEN_EXPIRATION', 3600))
    DB_NAME = os.environ.get('DB_NAME')

    print("DB_URL:", os.environ.get('DB_URL'))
