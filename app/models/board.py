from .db import db
from .membership import Membership


class Board(db.Model):
    __tablename__ = "boards"

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(32), nullable=False, unique=True)
    description = db.Column(db.String(256))
    private = db.Column(db.Boolean, nullable=False)

    owner = db.relationship("User")
    members = db.relationship("User", secondary="memberships")
    threads = db.relationship("Thread", cascade="all, delete")
    smilies= db.relationship("Smilie", cascade="all, delete")

    def to_dict(self):
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "name": self.name,
            "description": self.description,
            "private": self.private,
            "member_count": len(self.members)
        }
