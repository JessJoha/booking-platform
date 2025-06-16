from flask import Blueprint, request, jsonify
from extensions import db
from model.userModel import User

register_bp = Blueprint('register_bp', __name__)

def notify_user(user):
    # TODO: send email notification via notification microservice
    pass

@register_bp.route('/users/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('admin', 'user')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 409

    new_user = User(username=username, role=role)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    
    notify_user(new_user)

    return jsonify({'message': 'User registered successfully'}), 201
