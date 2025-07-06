import unittest
from unittest.mock import patch, MagicMock
import sys
import os


sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app


class ResetPasswordTestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    @patch('routes.reset_route.redis_client')
    @patch('routes.reset_route.User')
    @patch('routes.reset_route.db')
    def test_reset_password_success(self, mock_db, mock_user_class, mock_redis):
        # Simular código correcto en Redis
        mock_redis.get.return_value = "123456"

        # Simular usuario encontrado
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
