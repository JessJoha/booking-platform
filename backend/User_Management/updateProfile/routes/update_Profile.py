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
    """
    Update the authenticated user's profile.
    ---
    tags:
      - Profile
    summary: Update user profile
    description: Updates the profile of the authenticated user. Possible fields to update are phone, avatar, and description. Requires a JWT token in the Authorization header.
    security:
      - Bearer: []
    consumes:
      - application/json
    parameters:
      - in: header
        name: Authorization
        required: true
        type: string
        description: JWT token in the format 'Bearer &lt;token&gt;'
      - in: body
        name: body
        required: true
        description: JSON object with fields to update (phone, avatar, description).
        schema:
          type: object
          properties:
            phone:
              type: string
              example: "+1234567890"
            avatar:
              type: string
              example: "https://example.com/avatar.jpg"
            description:
              type: string
              example: "This is my profile description."
    responses:
      200:
        description: Profile updated successfully.
        schema:
          type: object
          properties:
            message:
              type: string
              example: Profile updated successfully
            profile:
              type: object
              properties:
                username:
                  type: string
                  example: johndoe
                phone:
                  type: string
                  example: "+1234567890"
                avatar:
                  type: string
                  example: "https://example.com/avatar.jpg"
                description:
                  type: string
                  example: "This is my profile description."
      400:
        description: No valid fields to update.
        schema:
          type: object
          properties:
            error:
              type: string
              example: No valid fields to update
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
