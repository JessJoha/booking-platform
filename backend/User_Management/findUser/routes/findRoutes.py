from flask import Blueprint, request, jsonify
from model.findModel import User

find_bp = Blueprint('find_bp', __name__)

@find_bp.route('/find/username/<string:username>', methods=['GET'])
def find_by_username(username):
    users = User.query.filter(User.username.like(f"%{username}%")).all()
    if not users:
        return jsonify({'error': 'No users found'}), 404
    return jsonify([
        {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role
        } for user in users
    ])
