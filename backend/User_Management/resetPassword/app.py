from flask import Flask
from flask_cors import CORS
from extensions import db
from routes.reset_route import reset_bp
from flasgger import Swagger
from config import Config
import os
from dotenv import load_dotenv
from pathlib import Path


env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)


app = Flask(__name__)
CORS(app)
app.config.from_object(Config)


db.init_app(app)


swagger = Swagger(app, template={
    "swagger": "2.0",
    "info": {
        "title": "Reset Password Service API",
        "description": "API documentation for the Reset Password microservice.",
        "version": "1.0.0"
    }
})


app.register_blueprint(reset_bp, url_prefix="/recover")
print("Swagger iniciado en: http://54.89.82.50:5006/apidocs")
print("Ruta activa: POST /recover/reset")


@app.route('/')
def index():
    """
    Health check endpoint.
    ---
    responses:
      200:
        description: Service is running
        examples:
          text: resetPasswordService is running
    """
    return "resetPasswordService is running", 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    print(f" http://34.234.124.88:{Config.RESET_SERVICE_PORT}/apidocs")
    print(f"{Config.RESET_SERVICE_PORT}")
    app.run(debug=True, host="0.0.0.0", port=app.config.get("RESET_SERVICE_PORT", 5006))
