import unittest
import bcrypt
import sys
import os
from unittest.mock import patch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db
from models.model import User
from config import Config

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class LoginAuthTestCase(unittest.TestCase):
    def setUp(self):
        # Configurar la aplicación para testing
        app.config.from_object(TestConfig)
        
        # Crear el contexto de la aplicación
        self.app_context = app.app_context()
        self.app_context.push()
        
        # Crear las tablas (db ya está inicializado en app.py)
        db.create_all()
        
        # Crear cliente de prueba
        self.app = app.test_client()

        # Crear usuario de prueba
        hashed_pw = bcrypt.hashpw('mypassword123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user = User(username='johndoe', password=hashed_pw, role='user',
                    email='johndoe@email.com', phone='+123456789')
        db.session.add(user)
        db.session.commit()

    def tearDown(self):
        # Limpiar la base de datos y el contexto
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    @patch('routes.routes.requests.post')
    def test_login_successful(self, mock_post):
        mock_post.return_value.status_code = 201
        payload = {
            "username": "johndoe",
            "password": "mypassword123"
        }
        response = self.app.post('/auth/login', json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.get_json())
        self.assertEqual(response.get_json()['message'], 'Login successful')

    def test_login_user_not_found(self):
        payload = {
            "username": "nouser",
            "password": "any"
        }
        response = self.app.post('/auth/login', json=payload)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {'error': 'User not found'})

    def test_login_missing_fields(self):
        payload = {"username": "johndoe"}
        response = self.app.post('/auth/login', json=payload)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {'error': 'Username and password are required'})

    def test_login_invalid_credentials(self):
        payload = {
            "username": "johndoe",
            "password": "wrongpassword"
        }
        response = self.app.post('/auth/login', json=payload)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.get_json(), {'error': 'Invalid credentials'})

if __name__ == '__main__':
    unittest.main()