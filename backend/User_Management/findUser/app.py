from flask import Flask
from dotenv import load_dotenv
from config import Config
from extensions import db
from routes.findRoutes import find_bp
from flask_cors import CORS


load_dotenv()

app = Flask(__name__)
CORS(app)

app.config.from_object(Config)
db.init_app(app)

app.register_blueprint(find_bp)

@app.route('/')
def index():
    return 'findUserService is running', 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=Config.FIND_USER_SERVICE_PORT)
