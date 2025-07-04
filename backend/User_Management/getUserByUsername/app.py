from flask import Flask
from config import Config
from routes.by_userRoute import user_bp
from flasgger import Swagger

app = Flask(__name__)
app.config.from_object(Config)

# Swagger configuration
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
    app.run(debug=True, host='0.0.0.0', port=Config.PROFILE_SERVICE_PORT)
