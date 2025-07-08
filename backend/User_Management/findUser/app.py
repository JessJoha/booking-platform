from flask import Flask
from flask_cors import CORS
from flasgger import Swagger
from extensions import db
from routes.findRoutes import find_bp
from config import Config  
import os

app = Flask(__name__)
CORS(app)


app.config.from_object(Config)


db.init_app(app)

# ✅ Configuración Swagger
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
    return 'findUserService is running', 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    print(f"Swagger UI available a: http://54.89.82.50:{Config.LOGIN_SERVICE_PORT}/apidocs")
    print(f"tests")
    print(f"Find User Service running on port {Config.LOGIN_SERVICE_PORT}")
    app.run(debug=True, host='0.0.0.0', port=Config.LOGIN_SERVICE_PORT)