from flask import Blueprint, request, jsonify
from extensions import db
from model.userModel import User

register_bp = Blueprint('register_bp', __name__)

def notify_user(user):
    pass  # notificación opcional

@register_bp.route('/users/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    phone = data.get('phone')
    email=data.get('email')
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
