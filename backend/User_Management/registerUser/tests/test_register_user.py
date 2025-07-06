import sys
import os
import pytest


sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db
from model.userModel import User  

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()

def test_register_user_success(client):
    response = client.post('/auth/users/register', json={
        "username": "testuser",
        "password": "testpass123",
        "phone": "+1234567890",
        "email": "test@example.com"
    })

    assert response.status_code == 201
    assert response.json['message'] == 'User registered successfully'

def test_register_user_missing_fields(client):
    response = client.post('/auth/users/register', json={
        "username": "incomplete"
    })

    assert response.status_code == 400
    assert 'error' in response.json
    assert response.json['error'] == 'Username, password, phone, and email are required'
