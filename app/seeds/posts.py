from app.models import db, User, Board, Thread, Post
from faker import Faker
from random import randint, choice
from datetime import datetime, timedelta

fake = Faker()


def seed_posts():
    threads = Thread.query.all()
    for thread in threads:
        for i in range(randint(1, 40)):
            thread.posts.append(Post(
                owner_id=randint(1, 20),
                thread_id=thread.id,
                created_at=thread.posts[i - 1].created_at + timedelta(minutes=5),
                body=fake.paragraph() if randint(1, 10) > 5 else fake.sentence(),
                last_edited=datetime.utcnow() if randint(1, 20) > 19 else None
            ))
        db.session.add(thread)
    db.session.commit()


def undo_posts():
    db.session.execute("TRUNCATE posts CASCADE;")
    db.session.commit()
