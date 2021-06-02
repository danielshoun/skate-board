from .db import db
from datetime import datetime


class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    thread_id = db.Column(db.Integer, db.ForeignKey("threads.id"), nullable=False)
    body = db.Column(db.String(4096), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    last_edited = db.Column(db.DateTime)

    def to_dict(self):
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "thread_id": self.thread_id,
            "body": self.body,
            "created_at": self.created_at.isoformat(),
            "last_edited": self.last_edited.isoformat() if self.last_edited else None
        }
