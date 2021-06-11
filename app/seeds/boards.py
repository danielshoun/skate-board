from app.models import db, User, Board
from faker import Faker
from random import randint

fake = Faker()


def seed_boards():
    boards = [
        Board(
            owner_id=1,
            name="General Discussion",
            description="Discuss things, generally",
            private=False
        ),
        Board(
            owner_id=1,
            name="Secret Board",
            description="Discuss your plans for world domination.",
            private=True
        )
    ]

    for _ in range(3):
        boards.append(
            Board(
                owner_id=randint(2, 20),
                name=fake.word(),
                description=fake.sentence(),
                private=False
            )
        )

    for board in boards:
        board.members.append(User.query.get(board.owner_id))

    db.session.add_all(boards)
    db.session.commit()

    for i in range(2, 21):
        for board in boards:
            if randint(1, 10) > 5 and board.owner_id != i:
                board.members.append(User.query.get(i))

    db.session.add_all(boards)
    db.session.commit()


def undo_boards():
    db.session.execute("TRUNCATE memberships CASCADE;")
    db.session.execute("TRUNCATE boards CASCADE;")
    db.session.commit()
