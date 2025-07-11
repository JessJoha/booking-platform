import unittest
from unittest.mock import patch
import sys
import os


sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app

class GetUserByUsernameTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch('routes.by_userRoute.collection') 
    def test_get_user_found(self, mock_collection):
        mock_user = {
            "username": "johndoe",
            "email": "johndoe@email.com",
            "id": 1
        }
        mock_collection.find_one.return_value = mock_user

        response = self.app.get('/user/johndoe')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), mock_user)

    @patch('routes.by_userRoute.collection')
    def test_get_user_not_found(self, mock_collection):
        mock_collection.find_one.return_value = None

        response = self.app.get('/user/nonexistentuser')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {"error": "User not found"})

if __name__ == '__main__':
    unittest.main()
