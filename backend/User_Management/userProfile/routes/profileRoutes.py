from flask import Blueprint, request, jsonify
from extensions import collection
from config import Config
from model.userProfile import UserProfile
import jwt

profile_bp = Blueprint('profile', __name__)

def decode_token(token):
    try:
        return jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def get_username_from_token():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None
    token = auth_header.split(" ")[1]
    decoded = decode_token(token)
    if decoded and "username" in decoded:
        return decoded["username"]
    return None

@profile_bp.route('/init', methods=['POST'])
def init_profile():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.split(" ")[1]
    decoded = decode_token(token)
    if not decoded:
        return jsonify({"error": "Invalid token"}), 401

    username = decoded.get("username")
    email = decoded.get("email")
    user_id = decoded.get("user_id")

    if not username:
        return jsonify({"error": "Username missing in token"}), 400

    existing = collection.find_one({"username": username})
    if existing:
        return jsonify({"message": "Profile already exists"}), 200

    new_profile = UserProfile(
        username=username,
        email=email or "",
        phone="",
        avatar="",
        description="",
        user_id=user_id or 1
    )

    collection.insert_one(new_profile.to_dict())
    return jsonify({"message": "Profile created", "profile": new_profile.to_dict()}), 201

@profile_bp.route('/', methods=['GET'])
def get_profile():
    username = get_username_from_token()
    if not username:
        return jsonify({"error": "Unauthorized"}), 401

    user = collection.find_one({"username": username}, {"_id": 0})
    if not user:
        return jsonify({"error": "Profile not found"}), 404

    return jsonify(user), 200
