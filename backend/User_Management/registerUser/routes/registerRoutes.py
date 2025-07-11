from flask import Blueprint, request, jsonify
from extensions import db
from model.userModel import User

register_bp = Blueprint('register_bp', __name__)

def notify_user(user):
    pass  

@register_bp.route('/users/register', methods=['POST'])
def register():
    """
    Register a new user.
    ---
    tags:
      - User Registration
    summary: Register a new user
    description: Registers a new user with username, password, phone, and email.
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        description: JSON object containing user registration data.
        schema:
          type: object
          required:
            - username
            - password
            - phone
            - email
          properties:
            username:
              type: string
              example: johndoe
            password:
              type: string
              example: mypassword123
            phone:
              type: string
              example: "+1234567890"
            email:
              type: string
              example: johndoe@email.com
    responses:
      201:
        description: User registered successfully.
        schema:
          type: object
          properties:
            message:
              type: string
              example: User registered successfully
      400:
        description: Missing required fields.
        schema:
          type: object
          properties:
            error:
              type: string
              example: Username, password, phone, and email are required
      409:
        description: Username or phone already exists.
        schema:
          type: object
          properties:
            error:
              type: string
              example: Username already exists
    """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    phone = data.get('phone')
    email = data.get('email')
    role = data.get('admin', 'user')

    if not username or not password or not phone or not email:
        return jsonify({'error': 'Username, password, phone, and email are required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 409

    if User.query.filter_by(phone=phone).first():
        return jsonify({'error': 'Phone already in use'}), 409

    new_user = User(username=username, phone=phone, role=role, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    notify_user(new_user)

    return jsonify({'message': 'User registered successfully'}), 201
