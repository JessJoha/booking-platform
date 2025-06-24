from flask import Flask
from routes.profileRoutes import profile_bp
from config import Config
from dotenv import load_dotenv


load_dotenv()


app = Flask(__name__)



app.config.from_object(Config)


app.register_blueprint(profile_bp, url_prefix='/profile')


@app.route('/')
def index():
    return 'userprofileservice is running', 200 

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=Config.PROFILE_SERVICE_PORT)
