import string
from random import choice
from app.models import Membership
from sqlalchemy import and_


def validation_errors_to_error_messages(validation_errors):
    errorMessages = {}
    for field in validation_errors:
        errorMessages[field] = []
        for error in validation_errors[field]:
            errorMessages[field].append(f"{error}")
    return errorMessages


def generate_token(length):
    return "".join([choice(string.ascii_letters + string.digits) for _ in range(length)])


def check_board_membership(board, user):
    if board.private:
        if not user:
            return {"errors": "You must be logged in to view private boards."}, 401
        membership = Membership.query.filter(
            and_(
                board.id == Membership.board_id,
                user.id == Membership.user_id
            )
        ).first()
        if not membership:
            return {"errors": "You must be a member of a private board to view it."}, 401
    return {"membership": True}
