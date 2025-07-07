from flask import Flask
from config import Config
from routes.profileRoutes import profile_bp
from flasgger import Swagger 

app = Flask(__name__)
app.config.from_object(Config)

# Swagger configuration
swagger = Swagger(app, template={
    "swagger": "2.0",
    "info": {
        "title": "User Profile Service API",
        "description": "API documentation for the User Profile microservice.",
        "version": "1.0.0"
    }
})

app.register_blueprint(profile_bp, url_prefix="/profile")

@app.route('/')
def index():
    """
    Health check endpoint.
    ---
    responses:
      200:
        description: Service is running
        examples:
          text: myProfileService is running
    """
    return 'myProfileService is running', 200

if __name__ == '__main__':
    print(f" http://54.89.82.50:{Config.PROFILE_SERVICE_PORT}/apidocs")
    print(f"{Config.PROFILE_SERVICE_PORT}")
    app.run(debug=True, host='0.0.0.0', port=Config.PROFILE_SERVICE_PORT)
