from .db import db


class Smilie(db.Model):
    __tablename__ = "smilies"

    id = db.Column(db.Integer, primary_key=True)
    board_id = db.Column(db.Integer, db.ForeignKey("boards.id"))
    url = db.Column(db.String(500), nullable=False)
    name = db.Column(db.String(16), nullable=False)

    __table_args__ = (db.UniqueConstraint('board_id', 'name', name='_board_unique_name'),)

    def to_dict(self):
        return {
            "id": self.id,
            "board_id": self.board_id,
            "url": self.url,
            "name": self.name
        }
