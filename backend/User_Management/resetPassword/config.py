import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI', 'sqlite:///test.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    RESET_SERVICE_PORT = int(os.getenv('RESET_SERVICE_PORT', 5006))
