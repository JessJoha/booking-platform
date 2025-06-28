import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DB_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SEND_SERVICE_PORT = int(os.getenv('SEND_SERVICE_PORT', 5005))
