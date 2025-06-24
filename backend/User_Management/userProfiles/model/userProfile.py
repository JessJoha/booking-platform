class UserProfile:
    def __init__(self, username, email=None, phone=None, avatar=None, description=None):
        self.username = username
        self.email = email
        self.phone = phone
        self.avatar = avatar
        self.description = description

    def to_dict(self):
        return {
            'username': self.username,
            'email': self.email,
            'phone': self.phone,
            'avatar': self.avatar,
            'description': self.description
        }
