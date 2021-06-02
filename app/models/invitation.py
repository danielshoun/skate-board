from .db import db
from app.utils import generate_token


class Invitation(db.Model):
    token = db.Column(db.String(32), nullable=False, default=generate_token(32), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    board_id = db.Column(db.Integer, db.ForeignKey("boards.id"))
