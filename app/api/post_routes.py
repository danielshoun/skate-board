from flask import Blueprint, request
from flask_login import login_required, current_user
from app.utils import validation_errors_to_error_messages, check_board_membership
from app.forms import PostForm
from app.models import Board, db, Thread, Post

post_routes = Blueprint("posts", __name__)


@post_routes.route("", methods=["POST"])
@login_required
def create_post():
    form = PostForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        thread = Thread.query.get(form.data["thread_id"])
        board = Board.query.get(thread.board_id)
        membership_check = check_board_membership(board, current_user)
        if "errors" in membership_check:
            return membership_check
        if thread.locked:
            return {"errors": "You cannot make new posts in a locked thread."}, 400
        post = Post(
            owner_id=current_user.id,
            thread_id=form.data["thread_id"],
            body=form.data["body"]
        )
        db.session.add(post)
        db.session.commit()
        return post.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}, 400
