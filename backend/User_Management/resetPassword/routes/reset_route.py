from flask import Blueprint, request, jsonify
from extensions import db, redis_client
from model.reset_model import User

reset_bp = Blueprint("reset_bp", __name__)

@reset_bp.route("/reset", methods=["POST"])
def reset_password():
    data = request.get_json()
    email = data.get("email")
    code = data.get("code")
    new_password = data.get("new_password")

    stored_code = redis_client.get(f"recover:{email}")
    if not stored_code:
        return jsonify({"error": "Code expired or not found"}), 400
    if stored_code != code:
        return jsonify({"error": "Invalid recovery code"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.set_password(new_password)
    db.session.commit()
    redis_client.delete(f"recover:{email}")

    return jsonify({"message": "Password successfully reset"}), 200
