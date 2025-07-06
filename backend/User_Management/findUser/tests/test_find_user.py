import unittest
import sys
import os
from pathlib import Path

# 🔧 FIX: Configurar variables de entorno ANTES de importar app
os.environ["TESTING"] = "1"
# Variables necesarias para que Config no falle
os.environ["SECRET_KEY"] = "test-secret-key"
os.environ["JWT_SECRET"] = "test-jwt-secret"
os.environ["DB_URL"] = "sqlite:///:memory:"  # Base de datos en memoria para tests
os.environ["FIND_USER_SERVICE_PORT"] = "5002"
os.environ["ACCESS_TOKEN_EXPIRATION"] = "3600"
os.environ["DB_NAME"] = "testdb"

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db
from model.findModel import User

class FindUserTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config['TESTING'] = True

        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()
            user = User(username='test', password='1234', role='user', email='test@example.com')
            db.session.add(user)
            db.session.commit()

    def tearDown(self):
        with self.app.app_context():
            db.drop_all()

    def test_find_existing_user(self):
        """Test para encontrar un usuario existente"""
        response = self.client.get('/find/username/test')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['username'], 'test')
        self.assertEqual(data[0]['email'], 'test@example.com')
        self.assertEqual(data[0]['role'], 'user')

    def test_find_nonexistent_user(self):
        """Test para buscar un usuario que no existe"""
        response = self.client.get('/find/username/unknown')
        self.assertEqual(response.status_code, 404)
        data = response.get_json()
        self.assertIn('error', data)
        self.assertEqual(data['error'], 'No users found')

    def test_find_partial_username(self):
        """Test para búsqueda parcial de username"""

        with self.app.app_context():
            user1 = User(username='testuser1', password='1234', role='user', email='test1@example.com')
            user2 = User(username='testuser2', password='1234', role='admin', email='test2@example.com')
            db.session.add(user1)
            db.session.add(user2)
            db.session.commit()
        
       
        response = self.client.get('/find/username/test')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(len(data), 3) 
        

        for user in data:
            self.assertIn('test', user['username'].lower())

    def test_find_case_insensitive(self):
        """Test para verificar búsqueda insensible a mayúsculas/minúsculas"""
        response = self.client.get('/find/username/TEST')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['username'], 'test')

if __name__ == '__main__':
    unittest.main()