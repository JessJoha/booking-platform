from flask import Flask
from flask_cors import CORS
from extensions import db
from routes.routes import auth_bp
from flasgger import Swagger
import pymysql
from config import Config
from pathlib import Path
from dotenv import load_dotenv
import os

pymysql.install_as_MySQLdb()

app = Flask(__name__)


load_dotenv(dotenv_path=Path('.') / '.env')
app.config.from_object(Config)


CORS(app)
db.init_app(app)


swagger = Swagger(app, template={
    "swagger": "2.0",
    "info": {
        "title": "Login Auth Service API",
        "description": "API documentation for the Login Auth microservice.",
        "version": "1.0.0"
    }
})


app.register_blueprint(auth_bp, url_prefix='/auth')

@app.route('/')
def index():
    return 'login_auth is running', 200

if __name__ == '__main__':
    with app.app_context():
        try:
            db.create_all()
            print("Connected to database and ensured tables exist.")
        except Exception as e:
            print("Error while connecting to database or creating tables:")
            print(e)

    app.run(debug=True, host='0.0.0.0', port=app.config.get('LOGIN_SERVICE_PORT', 5000))
