from flask import Blueprint, request, jsonify
from extensions import db, redis_client
from model.reset_model import User

reset_bp = Blueprint("reset_bp", __name__)

@reset_bp.route("/reset", methods=["POST"])
def reset_password():
    """
    Reset user password.
    ---
    tags:
      - Password Recovery
    summary: Reset user password
    description: Allows a user to reset their password using email, recovery code, and new password.
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        description: JSON object containing email, code, and new_password.
        schema:
          type: object
          required:
            - email
            - code
            - new_password
          properties:
            email:
              type: string
              example: johndoe@email.com
            code:
              type: string
              example: "123456"
            new_password:
              type: string
              example: myNewPassword123
        responses:
      200:
        description: Password successfully reset.
        schema:
          type: object
          properties:
            message:
              type: string
              example: Password successfully reset
      400:
        description: Invalid or expired code, or invalid input.
        schema:
          type: object
          properties:
            error:
              type: string
              example: Code expired or not found
      404:
        description: User not found.
        schema:
          type: object
          properties:
            error:
              type: string
              example: User not found
    """
    data = request.get_json()
    email = data.get("email")
    code = data.get("code")
    new_password = data.get("new_password")

    print(f"Received reset for {email} with code {code}")

    if not email or not code or not new_password:
        return jsonify({"error": "Missing required fields"}), 400

    stored_code = redis_client.get(f"recover:{email}")
    print(f"📦 Redis code: {stored_code}")
    if not stored_code:
        return jsonify({"error": "Code expired or not found"}), 400

    if stored_code.strip() != code.strip():
        return jsonify({"error": "Invalid recovery code"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        print("User not found in database")
        return jsonify({"error": "User not found"}), 404

    user.set_password(new_password)
    db.session.add(user)  
    db.session.commit()

    redis_client.delete(f"recover:{email}")
    print(f"✅ Contraseña restablecida para {email}")
    return jsonify({"message": "Password successfully reset"}), 200
