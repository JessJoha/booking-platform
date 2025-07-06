from flask import Flask
from dotenv import load_dotenv
from extensions import db
from routes.findRoutes import find_bp
from flask_cors import CORS
from flasgger import Swagger
import os

load_dotenv()

app = Flask(__name__)
CORS(app)


if not app.config.get("TESTING"):
    from config import Config
    app.config.from_object(Config)

db.init_app(app)

# Swagger configuration
swagger = Swagger(app, template={
    "swagger": "2.0",
    "info": {
        "title": "Find User Service API",
        "description": "API documentation for the Find User microservice.",
        "version": "1.0.0"
    }
})

app.register_blueprint(find_bp)

@app.route('/')
def index():
    """
    Health check endpoint.
    ---
    responses:
      200:
        description: Service is running
        examples:
          text: findUserService is running
    """
    return 'findUserService is running', 200

if __name__ == '__main__':
   
    from config import Config
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=Config.FIND_USER_SERVICE_PORT)
