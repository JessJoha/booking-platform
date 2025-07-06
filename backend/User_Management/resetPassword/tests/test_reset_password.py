import unittest
import sys
import os
from unittest.mock import patch, MagicMock

# Add the parent directory to the path so we can import the app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from app import app
except ImportError:
    
    from flask import Flask
    app = Flask(__name__)
    
    from routes.reset_route import reset_bp
    app.register_blueprint(reset_bp, url_prefix='/recover')

class ResetPasswordTestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True

    @patch('routes.reset_route.redis_client')
    @patch('routes.reset_route.User')
    @patch('routes.reset_route.db')
    def test_reset_password_success(self, mock_db, mock_user_class, mock_redis):
       
        mock_redis.get.return_value = "123456"
        
        # Mock user
        mock_user = MagicMock()
        mock_user_class.query.filter_by.return_value.first.return_value = mock_user
        
        payload = {
            "email": "johndoe@email.com",
            "code": "123456",
            "new_password": "myNewPassword123"
        }
        
        response = self.client.post("/recover/reset", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "Password successfully reset")
        mock_user.set_password.assert_called_once_with("myNewPassword123")
        mock_db.session.commit.assert_called_once()
        mock_redis.delete.assert_called_once_with("recover:johndoe@email.com")

    @patch('routes.reset_route.redis_client')
    def test_reset_password_code_not_found(self, mock_redis):
        mock_redis.get.return_value = None
        
        response = self.client.post("/recover/reset", json={
            "email": "test@example.com",
            "code": "000000",
            "new_password": "newpass"
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], "Code expired or not found")

    @patch('routes.reset_route.redis_client')
    def test_reset_password_invalid_code(self, mock_redis):
        mock_redis.get.return_value = "999999"
        
        response = self.client.post("/recover/reset", json={
            "email": "test@example.com",
            "code": "000000",
            "new_password": "newpass"
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], "Invalid recovery code")

    @patch('routes.reset_route.redis_client')
    @patch('routes.reset_route.User')
    def test_reset_password_user_not_found(self, mock_user_class, mock_redis):
        mock_redis.get.return_value = "123456"
        mock_user_class.query.filter_by.return_value.first.return_value = None
        
        response = self.client.post("/recover/reset", json={
            "email": "test@example.com",
            "code": "123456",
            "new_password": "newpass"
        })
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json["error"], "User not found")

if __name__ == "__main__":
    unittest.main()