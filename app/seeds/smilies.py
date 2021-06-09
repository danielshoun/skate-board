from app.models import db, Smilie


def seed_smilies():
    smilies = [
        Smilie(
            url="https://skate-board-app.s3.amazonaws.com/smile.gif",
            name=":)"
        ),
        Smilie(
            url="https://skate-board-app.s3.amazonaws.com/frown.gif",
            name=":("
        ),
        Smilie(
            url="https://skate-board-app.s3.amazonaws.com/wink.gif",
            name=";)"
        ),
        Smilie(
            url="https://skate-board-app.s3.amazonaws.com/biggrin.gif",
            name=":D"
        ),
        Smilie(
            url="https://skate-board-app.s3.amazonaws.com/cool.gif",
            name=":cool:"
        ),
        Smilie(
            url="https://skate-board-app.s3.amazonaws.com/emot-v.gif",
            name=":v:"
        ),
        Smilie(
            url="https://skate-board-app.s3.amazonaws.com/emot-golfclap.gif",
            name=":golfclap:"
        ),
        Smilie(
            url="https://skate-board-app.s3.amazonaws.com/emot-toot.gif",
            name=":toot:"
        ),
        Smilie(
            url="https://skate-board-app.s3.amazonaws.com/emot-hfive.gif",
            name=":highfive:"
        ),
        Smilie(
            url="https://skate-board-app.s3.amazonaws.com/eyepop.001.gif",
            name=":eyepop:"
        ),
        Smilie(
            url="https://skate-board-app.s3.amazonaws.com/stare2.gif",
            name=":stare:"
        ),
        Smilie(
            url="https://skate-board-app.s3.amazonaws.com/emot-psyduck.gif",
            name=":psyduck:"
        ),
    ]

    db.session.add_all(smilies)
    db.session.commit()


def undo_smilies():
    db.session.execute("TRUNCATE smilies CASCADE;")
    db.session.commit()
