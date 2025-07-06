import unittest
from unittest.mock import patch, MagicMock
import sys
import os


sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app


class SendRecoveryCodeTestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    @patch('routes.requestRoute.send_email')
    @patch('routes.requestRoute.redis_client')
    @patch('routes.requestRoute.User')
    def test_send_code_success(self, mock_user_class, mock_redis, mock_send_email):
        # Simular usuario encontrado
        mock_user = MagicMock()
        mock_user_class.query.filter_by.return_value.first.return_value = mock_user

        # Realizar la solicitud POST
        response = self.client.post('/recover/request', json={
            "email": "johndoe@email.com"
        })

        # Verificaciones
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["message"], "Recovery code sent via email")
        mock_redis.setex.assert_called_once()
        mock_send_email.assert_called_once()

    @patch('routes.requestRoute.User')
    def test_send_code_user_not_found(self, mock_user_class):
        mock_user_class.query.filter_by.return_value.first.return_value = None

        response = self.client.post('/recover/request', json={
            "email": "unknown@email.com"
        })

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json()["error"], "User not found")


if __name__ == "__main__":
    unittest.main()
