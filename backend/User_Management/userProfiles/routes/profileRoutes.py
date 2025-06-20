from flask import Blueprint, request, jsonify
from extensions import collection
from config import Config
import jwt

profile_bp = Blueprint('profile', __name__)

def decode_token(token):
    try:
        decoded = jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
        return decoded
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:   
        return None

def get_username_from_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None
    token = auth_header.split(" ")[1]
    decoded = decode_token(token)
    if decoded and "username" in decoded:
        return decoded["username"]
    return None


@profile_bp.route('/profile/init', methods=['POST'])
def init_profile():
    username = get_username_from_token()
    if not username:
        return jsonify({"error": "Unauthorized"}), 401

    
    existing = collection.find_one({"username": username})
    if existing:
        return jsonify({"message": "Profile already exists"}), 200

   
    data = request.json or {}
    new_profile = {
        "username": username,
        "email": data.get("email", ""),
        "phone": data.get("phone", ""),
        "avatar": data.get("avatar", ""),
        "description": data.get("description", "")
    }

    collection.insert_one(new_profile)
    return jsonify({"message": "Profile created", "profile": new_profile}), 201



@profile_bp.route('/profile', methods=['GET'])
def get_profile():
    username = get_username_from_token()
    if not username:
        return jsonify({"error": "Unauthorized"}), 401

    user = collection.find_one({"username": username}, {"_id": 0})
    if not user:
        return jsonify({"error": "Profile not found"}), 404

    return jsonify(user), 200

@profile_bp.route('/profile', methods=['PUT'])
def update_profile():
    username = get_username_from_token()
    if not username:
        return jsonify({"error": "Unauthorized"}), 401

    if not collection.find_one({"username": username}):
        return jsonify({"error": "Profile not found"}), 404

    data = request.json or {}
    update_data = {k: v for k, v in {
        "phone": data.get("phone"),
        "avatar": data.get("avatar"),
        "description": data.get("description")
    }.items() if v}

    if not update_data:
        return jsonify({"error": "No valid fields to update"}), 400

    collection.update_one({"username": username}, {"$set": update_data})
    updated = collection.find_one({"username": username}, {"_id": 0})

    return jsonify({"message": "Profile updated successfully", "profile": updated}), 200