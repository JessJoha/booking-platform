import unittest
from app import app, db
from model.findModel import User

class FindUserTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # DB temporal
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
        response = self.client.get('/find/username/test')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['username'], 'test')

    def test_find_nonexistent_user(self):
        response = self.client.get('/find/username/unknown')
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.get_json())

if __name__ == '__main__':
    unittest.main()