from flask import Blueprint, request, jsonify
from extensions import redis_client
from model.recoveryModel import User
from utils.email_utils import send_email
import random

recover_bp = Blueprint("recover_bp", __name__)

@recover_bp.route("/request", methods=["POST"])
def request_code():
    data = request.get_json()
    email = data.get("email")

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    code = str(random.randint(100000, 999999))
    redis_client.setex(f"recover:{email}", 300, code)

    send_email(email, code)
    return jsonify({"message": "Recovery code sent via email"}), 200
