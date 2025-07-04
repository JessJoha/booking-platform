from flask import Flask
from config import Config
from backend.User_Management.updateProfile.routes.update_Profile import update_bp
from flasgger import Swagger 

app = Flask(__name__)
app.config.from_object(Config)

# Swagger configuration
swagger = Swagger(app, template={
    "swagger": "2.0",
    "info": {
        "title": "Update Profile Service API",
        "description": "API documentation for the Update Profile microservice.",
        "version": "1.0.0"
    }
})

app.register_blueprint(update_bp, url_prefix="/profile")

@app.route('/')
def index():
    """
    Health check endpoint.
    ---
    responses:
      200:
        description: Service is running
        examples:
          text: updateProfileService is running
    """
    return 'updateProfileService is running', 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=Config.PROFILE_SERVICE_PORT)
