from flask import Blueprint, request, jsonify
from extensions import collection
from config import Config
import jwt

update_bp = Blueprint('update_bp', __name__)

def decode_token(token):
    try:
        return jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def get_username_from_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None
    try:
        token = auth_header.split(" ")[1]
        decoded = decode_token(token)
        if decoded and "username" in decoded:
            return decoded["username"]
    except:
        return None
    return None

@update_bp.route('/', methods=['PUT'])
def update_profile():
    username = get_username_from_token()
    if not username:
        return jsonify({"error": "Unauthorized"}), 401


    existing_profile = collection.find_one({"username": username})
    if not existing_profile:
        return jsonify({"error": "Profile not found"}), 404

    
    data = request.json or {}
    update_data = {k: v for k, v in {
        "phone": data.get("phone"),
        "avatar": data.get("avatar"),
        "description": data.get("description")
    }.items() if v is not None}

    if not update_data:
        return jsonify({"error": "No valid fields to update"}), 400

    
    collection.update_one({"username": username}, {"$set": update_data})

    updated_profile = collection.find_one({"username": username}, {"_id": 0})
    return jsonify({"message": "Profile updated successfully", "profile": updated_profile}), 200
