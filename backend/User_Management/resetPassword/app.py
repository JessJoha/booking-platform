from flask import Flask
from flask_cors import CORS
from extensions import db
from routes.reset_route import reset_bp
from flasgger import Swagger
import os

app = Flask(__name__)
CORS(app)


app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI', 'sqlite:///test.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'test-secret-key')


if not os.environ.get('TESTING') and not app.config.get("TESTING"):
    from dotenv import load_dotenv
    from pathlib import Path
    from config import Config

    load_dotenv(dotenv_path=Path('.') / '.env')
    app.config.from_object(Config)

swagger = Swagger(app, template={
    "swagger": "2.0",
    "info": {
        "title": "Reset Password Service API",
        "description": "API documentation for the Reset Password microservice.",
        "version": "1.0.0"
    }
})


db.init_app(app)
app.register_blueprint(reset_bp, url_prefix="/recover")

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
    app.run(debug=True, host="0.0.0.0", port=app.config.get("RESET_SERVICE_PORT", 5004))