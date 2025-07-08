
from flask import Flask
from flask_cors import CORS
from extensions import db
from routes.requestRoute import recover_bp
from flasgger import Swagger
import os
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path('.') / '.env')

from config import Config

app = Flask(__name__)
CORS(app)


if os.getenv('TESTING') == 'True':
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
elif not app.config.get("TESTING"):
    from dotenv import load_dotenv
    from pathlib import Path
    from config import Config


    app.config.from_object(Config)

swagger = Swagger(app, template={
    "swagger": "2.0",
    "info": {
        "title": "Send Recovery Code Service API",
        "description": "API documentation for the Send Recovery Code microservice.",
        "version": "1.0.0"
    }
})

db.init_app(app)
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
    print(f" http://34.234.124.88:{Config.SEND_SERVICE_PORT}/apidocs")
    print(f"{Config.SEND_SERVICE_PORT}")        
    app.run(debug=True, host="0.0.0.0", port=app.config.get("SEND_SERVICE_PORT", 5005))

