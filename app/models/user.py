from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime


class User(db.Model, UserMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(16), nullable=False, unique=True)
    email = db.Column(db.String(256), nullable=False, unique=True)
    hashed_password = db.Column(db.String(256), nullable=False)
    reg_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    avatar_url = db.Column(db.String(256))
    title = db.Column(db.String(128))

    boards_owned = db.relationship("Board")
    boards_joined = db.relationship("Board", secondary="memberships")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "reg_date": self.reg_date.isoformat(),
            "avatar_url": self.avatar_url,
            "title": self.title,
            "boards_joined": {board.id: board.to_dict() for board in self.boards_joined}
        }
