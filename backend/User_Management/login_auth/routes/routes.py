from flask import Blueprint, request, jsonify
from extensions import db
from models.model import User
import bcrypt, jwt, datetime, os
import requests

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

   
    payload = {
        'user_id': user.id,
        'username': user.username,
        'role': user.role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=int(os.getenv('ACCESS_TOKEN_EXPIRATION')))
    }

    token = jwt.encode(payload, os.getenv('JWT_SECRET'), algorithm='HS256')
    if isinstance(token, bytes):
        token = token.decode('utf-8')

   
    profile_payload = {
        "username": user.username,
        "email": getattr(user, "email", ""),
        "phone": "",
        "avatar": "",
        "description": ""
    }

    headers = {
        "Authorization": f"Bearer {token}"
    }
    try:
        response = requests.post(
            "http://35.170.155.189:5003/profile/profile/init",
            json=profile_payload,
            headers=headers,
            timeout=5
        )
        print(f"[INFO] Perfil creado/verificado: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] No se pudo conectar al microservicio de perfil: {e}")

    return jsonify({'message': 'Login successful', 'token': token}), 200
