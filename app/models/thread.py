from .db import db


class Thread(db.Model):
    __tablename__ = "threads"

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    board_id = db.Column(db.Integer, db.ForeignKey("boards.id"), nullable=False)
    title = db.Column(db.String(128), nullable=False)
    pinned = db.Column(db.Boolean, nullable=False, default=False)
    locked = db.Column(db.Boolean, nullable=False, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "board_id": self.board_id,
            "title": self.title,
            "pinned": self.pinned,
            "locked": self.locked
        }