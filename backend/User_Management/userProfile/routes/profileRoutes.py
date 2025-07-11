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
    """
    Initialize user profile.
    ---
    tags:
      - Profile
    summary: Initialize user profile
    description: Creates the user profile if it does not exist, using data from the JWT token in the Authorization header.
    security:
      - Bearer: []
    consumes:
      - application/json
    parameters:
      - in: header
        name: Authorization
        required: true
        type: string
        description: JWT token in the format 'Bearer <token>'
      - in: body
        name: body
        required: false
        description: Optional JSON body (not used, profile is created from token data).
        schema:
          type: object
    responses:
      200:
        description: Profile already exists.
        schema:
          type: object
          properties:
            message:
              type: string
              example: Profile already exists
      201:
        description: Profile created successfully.
        schema:
          type: object
          properties:
            message:
              type: string
              example: Profile created
            profile:
              type: object
      400:
        description: Username missing in token.
        schema:
          type: object
          properties:
            error:
              type: string
              example: Username missing in token
      401:
        description: Unauthorized or invalid token.
        schema:
          type: object
          properties:
            error:
              type: string
              example: Unauthorized
    """
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
    """
    Get the authenticated user's profile.
    ---
    tags:
      - Profile
    summary: Get user profile
    description: Returns the profile of the authenticated user. Requires a JWT token in the Authorization header.
    security:
      - Bearer: []
    responses:
      200:
        description: Profile data returned successfully.
        schema:
          type: object
          properties:
            username:
              type: string
              example: johndoe
            email:
              type: string
              example: johndoe@email.com
            phone:
              type: string
              example: "+1234567890"
            avatar:
              type: string
              example: "https://example.com/avatar.jpg"
            description:
              type: string
              example: "This is my profile description."
            user_id:
              type: integer
              example: 1
      401:
        description: Unauthorized. JWT token is missing or invalid.
        schema:
          type: object
          properties:
            error:
              type: string
              example: Unauthorized
      404:
        description: Profile not found.
        schema:
          type: object
          properties:
            error:
              type: string
              example: Profile not found
    """
    username = get_username_from_token()
    if not username:
        return jsonify({"error": "Unauthorized"}), 401

    user = collection.find_one({"username": username}, {"_id": 0})
    if not user:
        return jsonify({"error": "Profile not found"}), 404

    return jsonify(user), 200
