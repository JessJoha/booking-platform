from flask import Flask
from routes.by_userRoute import user_bp
from flasgger import Swagger
import os

app = Flask(__name__)


if not app.config.get("TESTING"):
    from config import Config
    app.config.from_object(Config)


swagger = Swagger(app, template={
    "swagger": "2.0",
    "info": {
        "title": "Get User By Username Service API",
        "description": "API documentation for the Get User By Username microservice.",
        "version": "1.0.0"
    }
})

app.register_blueprint(user_bp, url_prefix="/user")

@app.route('/')
def index():
    """
    Health check endpoint.
    ---
    responses:
      200:
        description: Service is running
        examples:
          text: getUserByUsernameService is running
    """
    return 'getUserByUsernameService is running', 200

if __name__ == '__main__':
    from config import Config 
    print(f" http://54.89.82.50:{Config.GET_PROFILE_SERVICE_PORT}/apidocs")
    print(f"{Config.GET_PROFILE_SERVICE_PORT}")
 
    app.run(debug=True, host='0.0.0.0', port=Config.GET_PROFILE_SERVICE_PORT)
