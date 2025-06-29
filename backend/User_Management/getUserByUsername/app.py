from flask import Flask
from config import Config
from backend.User_Management.getUserByUsername.routes.by_userRoute import user_bp

app = Flask(__name__)
app.config.from_object(Config)

app.register_blueprint(user_bp, url_prefix="/user")

@app.route('/')
def index():
    return 'getUserByUsernameService is running', 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=Config.PROFILE_SERVICE_PORT)
