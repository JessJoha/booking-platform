from flask import Blueprint, request, jsonify
from extensions import db
from models.model import User
import bcrypt, jwt, datetime, os
import requests

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    User login endpoint.
    ---
    tags:
      - Authentication
    summary: User login
    description: Authenticates a user with username and password. Returns a JWT token if credentials are valid.
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        description: JSON object containing username and password.
        schema:
          type: object
          required:
            - username
            - password
          properties:
            username:
              type: string
              example: johndoe
            password:
              type: string
              example: mypassword123
    responses:
      200:
        description: Login successful. Returns a JWT token.
        schema:
          type: object
          properties:
            message:
              type: string
              example: Login successful
            token:
              type: string
              example: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
      400:
        description: Username and password are required.
        schema:
          type: object
          properties:
            error:
              type: string
              example: Username and password are required
      401:
        description: Invalid credentials.
        schema:
          type: object
          properties:
            error:
              type: string
              example: Invalid credentials
      404:
        description: User not found.
        schema:
          type: object
          properties:
            error:
              type: string
              example: User not found
    """
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
            "http://localhost:5010/profile/init",
            json=profile_payload,
            headers=headers,
            timeout=5
        )
        print(f"[INFO] Perfil creado/verificado: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] No se pudo conectar al microservicio de perfil: {e}")

    return jsonify({'message': 'Login successful', 'token': token}), 200
