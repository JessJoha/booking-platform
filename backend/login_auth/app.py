from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from config import Config
from extensions import db
from routes import auth_bp 
import os
from pathlib import Path


load_dotenv(dotenv_path=Path('.') / '.env')


app = Flask(__name__)
app.config.from_object(Config)


CORS(app)
db.init_app(app)
app.register_blueprint(auth_bp, url_prefix='/auth')

# Ruta base
@app.route('/')
def index():
    return 'login_auth is running', 200

# Ejecutar servidor
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=app.config['LOGIN_SERVICE_PORT'])
