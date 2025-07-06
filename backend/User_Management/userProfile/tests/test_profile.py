import unittest
from unittest.mock import patch
import sys
import os
import jwt
import mongomock


sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app
from config import Config


def generate_token(username="testuser", email="test@example.com", user_id=1):
    payload = {"username": username, "email": email, "user_id": user_id}
    return jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")


class UserProfileTestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.token = generate_token()
        self.headers = {"Authorization": f"Bearer {self.token}"}

       
        self.patcher = patch("routes.profileRoutes.collection", new=mongomock.MongoClient().db.collection)
        self.mock_collection = self.patcher.start()

    def tearDown(self):
        self.patcher.stop()

    def test_init_profile_success(self):
        response = self.client.post("/profile/init", headers=self.headers)
        self.assertEqual(response.status_code, 201)
        self.assertIn("profile", response.get_json())

    def test_init_profile_already_exists(self):
        self.mock_collection.insert_one({
            "username": "testuser",
            "email": "test@example.com",
            "phone": "",
            "avatar": "",
            "description": "",
            "user_id": 1
        })
        response = self.client.post("/profile/init", headers=self.headers)
        self.assertEqual(response.status_code, 200)
        self.assertIn("Profile already exists", response.get_json()["message"])

    def test_init_profile_invalid_token(self):
        bad_headers = {"Authorization": "Bearer invalidtoken"}
        response = self.client.post("/profile/init", headers=bad_headers)
        self.assertEqual(response.status_code, 401)
        self.assertIn("Invalid token", response.get_json()["error"])

    def test_get_profile_success(self):
        self.mock_collection.insert_one({
            "username": "testuser",
            "email": "test@example.com",
            "phone": "+1234567890",
            "avatar": "https://example.com/avatar.jpg",
            "description": "Test profile",
            "user_id": 1
        })
        response = self.client.get("/profile/", headers=self.headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["username"], "testuser")

    def test_get_profile_not_found(self):
        response = self.client.get("/profile/", headers=self.headers)
        self.assertEqual(response.status_code, 404)
        self.assertIn("Profile not found", response.get_json()["error"])

    def test_get_profile_unauthorized(self):
        response = self.client.get("/profile/")
        self.assertEqual(response.status_code, 401)
        self.assertIn("Unauthorized", response.get_json()["error"])


if __name__ == "__main__":
    unittest.main()
