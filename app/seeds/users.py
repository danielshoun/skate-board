from app.models import db, User
from faker import Faker
from random import randint

fake = Faker()


def seed_users():
    demo = User(
        username="Demo",
        email="demo@aa.io",
        password="password"
    )

    users = []
    used_names = set()
    used_emails = set()
    for i in range(19):
        username = fake.user_name()
        while username in used_names or len(username) > 16:
            username = fake.user_name()
        email = fake.email()
        while email in used_emails:
            email = fake.email()
        users.append(
            User(
                username=username,
                email=email,
                password="password",
                title=" ".join(fake.words(randint(1, 4)))
            )
        )

    db.session.add(demo)
    db.session.add_all(users)
    db.session.commit()


def undo_users():
    db.session.execute("TRUNCATE users CASCADE;")
    db.session.commit()
