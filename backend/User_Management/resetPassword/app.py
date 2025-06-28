from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path('.') / '.env')

from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db
from routes.reset_route import reset_bp

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)

app.register_blueprint(reset_bp, url_prefix="/recover")

@app.route('/')
def index():
    return "resetPasswordService is running", 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="0.0.0.0", port=Config.RESET_SERVICE_PORT)
