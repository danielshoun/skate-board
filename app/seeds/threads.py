from app.models import db, Board, Thread, Post
from faker import Faker
from random import randint, choice

fake = Faker()


# TODO: Add in fake dates to first posts to allow for more realistic looking chronology.
def seed_threads():
    for i in range(1, 6):
        board = Board.query.get(i)
        for _ in range(randint(10, 20)):
            thread = Thread(
                owner_id=choice(board.members).id,
                board_id=board.id,
                title=" ".join(fake.words(randint(1, 5))),
                pinned=True if randint(1, 10) > 9 else False,
                locked=True if randint(1, 10) > 9 else False
            )
            db.session.add(thread)
            db.session.flush()
            post = Post(
                owner_id=thread.owner_id,
                thread_id=thread.id,
                body=fake.paragraph() if randint(1, 10) > 5 else fake.sentence()
            )
            db.session.add(post)
    db.session.commit()


def undo_threads():
    db.session.execute("TRUNCATE threads CASCADE;")
    db.session.commit()
