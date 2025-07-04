from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path('.') / '.env')

from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db
from routes.requestRoute import recover_bp
from flasgger import Swagger 

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)

# Swagger configuration
swagger = Swagger(app, template={
    "swagger": "2.0",
    "info": {
        "title": "Send Recovery Code Service API",
        "description": "API documentation for the Send Recovery Code microservice.",
        "version": "1.0.0"
    }
})

app.register_blueprint(recover_bp, url_prefix="/recover")

@app.route('/')
def index():
    """
    Health check endpoint.
    ---
    responses:
      200:
        description: Service is running
        examples:
          text: sendRecoveryCodeService is running
    """
    return "sendRecoveryCodeService is running", 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="0.0.0.0", port=Config.SEND_SERVICE_PORT)
