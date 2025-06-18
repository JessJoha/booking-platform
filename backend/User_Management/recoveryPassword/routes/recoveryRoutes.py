from flask import Blueprint, request, jsonify
from extensions import db, redis_client
from model.recoveryModel import User
from backend.User_Management.recoveryPassword.email_utils import send_sms
import random

recover_bp = Blueprint('recover_bp', __name__)

@recover_bp.route('/recover/request', methods=['POST'])
def request_code():
    data = request.get_json()
    phone = data.get('phone')

    user = User.query.filter_by(phone=phone).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    code = str(random.randint(100000, 999999))
    redis_client.setex(f'recover:{phone}', 300, code)

    
    send_sms(phone, f'Your recovery code is: {code}')
    return jsonify({'message': 'Recovery code sent via SMS'}), 200

@recover_bp.route('/recover/reset', methods=['POST'])
def reset_password():
    data = request.get_json()
    phone = data.get('phone')
    code = data.get('code')
    new_password = data.get('new_password')

    stored_code = redis_client.get(f'recover:{phone}')
    if stored_code != code:
        return jsonify({'error': 'Invalid or expired code'}), 400

    user = User.query.filter_by(phone=phone).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user.set_password(new_password)
    db.session.commit()
    redis_client.delete(f'recover:{phone}')

    return jsonify({'message': 'Password successfully reset'}), 200
