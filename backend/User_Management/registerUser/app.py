
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path('.') / '.env')

from flask import Flask
from config import Config
from flask_cors import CORS
from extensions import db
from routes.registerRoutes import register_bp


import pymysql
pymysql.install_as_MySQLdb()


app = Flask(__name__)
CORS(app)

app.config.from_object(Config)
db.init_app(app)

app.register_blueprint(register_bp, url_prefix='/auth') 

@app.route('/')
def index():
    return 'register_user is running', 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=Config.REGISTER_SERVICE_PORT)