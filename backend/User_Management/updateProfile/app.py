from flask import Flask
from config import Config
from routes.update_route import update_bp

app = Flask(__name__)
app.config.from_object(Config)

app.register_blueprint(update_bp, url_prefix="/profile")

@app.route('/')
def index():
    return 'updateProfileService is running', 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=Config.PROFILE_SERVICE_PORT)
