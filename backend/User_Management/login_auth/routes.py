from flask import Blueprint, request, jsonify
from models.model import User
import bcrypt, jwt, datetime, os

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Crear token JWT
    payload = {
        'user_id': user.id,
        'role': user.role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=int(os.getenv('ACCESS_TOKEN_EXPIRATION')))
    }

    token = jwt.encode(payload, os.getenv('JWT_SECRET'), algorithm='HS256')
    if isinstance(token, bytes): 
        token = token.decode('utf-8')

    return jsonify({'message': 'Login successful', 'token': token}), 200
