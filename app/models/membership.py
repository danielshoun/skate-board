from .db import db


class Membership(db.Model):
    __tablename__ = "memberships"

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    board_id = db.Column(db.Integer, db.ForeignKey("boards.id"), primary_key=True)
