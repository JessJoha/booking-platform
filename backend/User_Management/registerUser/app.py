from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_cors import CORS
from extensions import db
from routes.registerRoutes import register_bp
from flasgger import Swagger
import pymysql
import os


pymysql.install_as_MySQLdb()

app = Flask(__name__)
CORS(app)


if not app.config.get("TESTING"):
    from dotenv import load_dotenv
    from pathlib import Path
    from config import Config

    load_dotenv(dotenv_path=Path('.') / '.env')
    app.config.from_object(Config)


swagger = Swagger(app, template={
    "swagger": "2.0",
    "info": {
        "title": "Register User Service API",
        "description": "API documentation for the Register User microservice.",
        "version": "1.0.0"
    }
})

# Initialize the database
db.init_app(app)
app.register_blueprint(register_bp, url_prefix='/auth')

@app.route('/')
def index():
    """
    Health check endpoint.
    ---
    responses:
      200:
        description: Service is running
        examples:
          text: register_user is running
    """
    return 'register_user is running', 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True, host='0.0.0.0', port=app.config.get('REGISTER_SERVICE_PORT', 5001))
