import unittest
from unittest.mock import patch, MagicMock
import sys
import os

# Asegura que se puede importar app.py
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app

class UpdateProfileTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()

    @patch('backend.User_Management.updateProfile.routes.update_Profile.get_username_from_token')
    @patch('backend.User_Management.updateProfile.routes.update_Profile.collection')
    def test_update_profile_success(self, mock_collection, mock_get_username):
        mock_get_username.return_value = 'johndoe'
        mock_collection.find_one.side_effect = [
            {"username": "johndoe"},
            {
                "username": "johndoe",
                "phone": "+1234567890",
                "avatar": "https://example.com/avatar.jpg",
                "description": "Updated profile"
            }
        ]
        mock_collection.update_one.return_value = MagicMock()

        response = self.client.put(
            '/profile/',
            json={
                "phone": "+1234567890",
                "avatar": "https://example.com/avatar.jpg",
                "description": "Updated profile"
            },
            headers={"Authorization": "Bearer mocktoken"}
        )

        self.assertEqual(response.status_code, 200)
        response_data = response.get_json()
        self.assertEqual(response_data["message"], "Profile updated successfully")
        self.assertIn("profile", response_data)

    @patch('backend.User_Management.updateProfile.routes.update_Profile.get_username_from_token')
    def test_update_profile_unauthorized(self, mock_get_username):
        mock_get_username.return_value = None

        response = self.client.put(
            '/profile/',
            json={"description": "Test"},
            headers={"Authorization": "Bearer invalidtoken"}
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.get_json()["error"], "Unauthorized")

    @patch('backend.User_Management.updateProfile.routes.update_Profile.get_username_from_token')
    @patch('backend.User_Management.updateProfile.routes.update_Profile.collection')
    def test_profile_not_found(self, mock_collection, mock_get_username):
        mock_get_username.return_value = 'johndoe'
        mock_collection.find_one.return_value = None

        response = self.client.put(
            '/profile/',
            json={"description": "Doesn't matter"},
            headers={"Authorization": "Bearer mocktoken"}
        )

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json()["error"], "Profile not found")

    @patch('backend.User_Management.updateProfile.routes.update_Profile.get_username_from_token')
    @patch('backend.User_Management.updateProfile.routes.update_Profile.collection')
    def test_no_valid_fields(self, mock_collection, mock_get_username):
        mock_get_username.return_value = 'johndoe'
        mock_collection.find_one.return_value = {"username": "johndoe"}

        response = self.client.put(
            '/profile/',
            json={},  # No valid fields
            headers={"Authorization": "Bearer mocktoken"}
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["error"], "No valid fields to update")

    @patch('backend.User_Management.updateProfile.routes.update_Profile.get_username_from_token')
    def test_no_authorization_header(self, mock_get_username):
        mock_get_username.return_value = None

        response = self.client.put(
            '/profile/',
            json={"description": "Test"}
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.get_json()["error"], "Unauthorized")

if __name__ == '__main__':
    unittest.main(verbosity=2)
