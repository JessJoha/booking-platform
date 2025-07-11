class UserProfile:
    def __init__(self, username, email=None, phone=None, avatar=None, description=None, user_id=1):
        self.id = user_id
        self.username = username
        self.email = email
        self.phone = phone
        self.avatar = avatar
        self.description = description

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "phone": self.phone,
            "avatar": self.avatar,
            "description": self.description
        }
