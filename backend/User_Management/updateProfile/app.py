from flask import Flask
from flask_cors import CORS
from flasgger import Swagger
from config import Config
from routes.update_Profile import update_bp

app = Flask(__name__)
CORS(app)

app.config.from_object(Config)


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
    app.run(debug=True, host='0.0.0.0', port=app.config.get("PROFILE_SERVICE_PORT", 5006))
