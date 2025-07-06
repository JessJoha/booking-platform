import unittest
import sys
import os
from flask import Flask

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from extensions import db
from model.userModel import User
from routes.registerRoutes import register_bp

class RegisterUserTestCase(unittest.TestCase):
    def setUp(self):
        
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.app.config['SECRET_KEY'] = 'test-secret-key'
        self.app.config['JWT_SECRET'] = 'test-jwt-secret'
        
      
        self.app.register_blueprint(register_bp, url_prefix='/auth')
        
      
        self.app_context = self.app.app_context()
        self.app_context.push()
        
      
        db.init_app(self.app)
        db.create_all()
        
       
        self.client = self.app.test_client()

    def tearDown(self):
   
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_register_user_success(self):
        response = self.client.post('/auth/users/register', json={
            "username": "testuser",
            "password": "testpass123",
            "phone": "+1234567890",
            "email": "test@example.com"
        })

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.get_json()['message'], 'User registered successfully')

    def test_register_user_missing_fields(self):
        response = self.client.post('/auth/users/register', json={
            "username": "incomplete"
        })

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.get_json())
        self.assertEqual(response.get_json()['error'], 'Username, password, phone, and email are required')

    def test_register_user_duplicate_username(self):
        
        user = User(username='testuser', password='hashedpass', phone='+1234567890', email='test@example.com', role='user')
        db.session.add(user)
        db.session.commit()
        
       
        response = self.client.post('/auth/users/register', json={
            "username": "testuser",
            "password": "testpass123",
            "phone": "+9876543210",
            "email": "test2@example.com"
        })

        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.get_json()['error'], 'Username already exists')

    def test_register_user_duplicate_phone(self):
        # Crear un usuario primero
        user = User(username='testuser1', password='hashedpass', phone='+1234567890', email='test@example.com', role='user')
        db.session.add(user)
        db.session.commit()
        

        response = self.client.post('/auth/users/register', json={
            "username": "testuser2",
            "password": "testpass123",
            "phone": "+1234567890",
            "email": "test2@example.com"
        })

        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.get_json()['error'], 'Phone already in use')

if __name__ == '__main__':
    unittest.main()