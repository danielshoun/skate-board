from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Board, db, Thread, Post
from app.utils import validation_errors_to_error_messages, check_board_membership
from app.forms import ThreadForm

thread_routes = Blueprint("threads", __name__)


@thread_routes.route("", methods=["POST"])
@login_required
def create_thread():
    form = ThreadForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        board = Board.query.get(form.data["board_id"])
        membership_check = check_board_membership(board, current_user)
        if "errors" in membership_check:
            return membership_check
        if board.owner_id != current_user.id and (form.data["pinned"] or form.data["locked"]):
            return {"errors": "You must be the board owner to pin or lock threads."}, 401
        thread = Thread(
            owner_id=current_user.id,
            board_id=form.data["board_id"],
            title=form.data["title"],
            pinned=form.data["pinned"],
            locked=form.data["locked"]
        )
        db.session.add(thread)
        db.session.flush()
        post = Post(
            owner_id=current_user.id,
            thread_id=thread.id,
            body=form.data["first_post_body"]
        )
        db.session.add(post)
        db.session.commit()
        return thread.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}, 400
