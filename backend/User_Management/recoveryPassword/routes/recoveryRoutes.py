from flask import Blueprint, request, jsonify
from extensions import db, redis_client
from model.recoveryModel import User
from email_utils import send_email
import random

recover_bp = Blueprint('recover_bp', __name__)

@recover_bp.route('/recover/request', methods=['POST'])
def request_code():
    data = request.get_json()
    email = data.get('email')

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    code = str(random.randint(100000, 999999))
    redis_client.setex(f'recover:{email}', 300, code)

    send_email(email, code)
    return jsonify({'message': 'Recovery code sent via email'}), 200

@recover_bp.route('/recover/reset', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')
    new_password = data.get('new_password')

    stored_code = redis_client.get(f'recover:{email}')
    if stored_code != code:
        return jsonify({'error': 'Invalid or expired code'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user.set_password(new_password)
    db.session.commit()
    redis_client.delete(f'recover:{email}')

    return jsonify({'message': 'Password successfully reset'}), 200
