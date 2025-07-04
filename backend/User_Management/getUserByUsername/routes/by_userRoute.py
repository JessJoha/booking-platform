from flask import Blueprint, jsonify
from extensions import collection

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/<string:username>', methods=['GET'])
def get_user_by_username(username):
    """
    Get a user by exact username.
    ---
    parameters:
      - name: username
        in: path
        type: string
        required: true
        description: Exact username to search for.
    responses:
      200:
        description: User found successfully.
        schema:
          type: object
          properties:
            username:
              type: string
              example: johndoe
            email:
              type: string
              example: johndoe@email.com
            id:
              type: integer
              example: 1
      404:
        description: User not found.
        schema:
          type: object
          properties:
            error:
              type: string
              example: User not found
    """
    user = collection.find_one({"username": username}, {"_id": 0})

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "username": user.get("username"),
        "email": user.get("email"),
        "id": user.get("id", 1) 
    }), 200
