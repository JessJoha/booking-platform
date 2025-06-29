from flask import Blueprint, jsonify
from extensions import collection

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/<string:username>', methods=['GET'])
def get_user_by_username(username):
    user = collection.find_one({"username": username}, {"_id": 0})

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "username": user.get("username"),
        "email": user.get("email"),
        "id": user.get("id", 1) 
    }), 200
