from flask import Blueprint, request, jsonify
from model.findModel import User

find_bp = Blueprint('find_bp', __name__)

@find_bp.route('/find/username/<string:username>', methods=['GET'])
def find_by_username(username):
    """
    Find users by partial username.
    ---
    parameters:
      - name: username
        in: path
        type: string
        required: true
        description: Partial or full username to search for.
    responses:
      200:
        description: List of users matching the username.
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
                example: 1
              username:
                type: string
                example: johndoe
              email:
                type: string
                example: johndoe@email.com
              role:
                type: string
                example: admin
      404:
        description: No users found.
        schema:
          type: object
          properties:
            error:
              type: string
              example: No users found
    examples:
      application/json: |
        GET /find/username/john
    """
    users = User.query.filter(User.username.like(f"%{username}%")).all()
    if not users:
        return jsonify({'error': 'No users found'}), 404
    return jsonify([
        {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role
        } for user in users
    ])
