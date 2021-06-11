from flask import Blueprint, request
from flask_login import login_required, current_user
from app.utils import validation_errors_to_error_messages, check_board_membership
from app.forms import PostForm
from app.models import Board, db, Thread, Post
from datetime import datetime

post_routes = Blueprint("posts", __name__)


@post_routes.route("/<int:post_id>")
def get_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return {"errors": f"No post exists with ID: {post_id}"}, 400
    thread = Thread.query.get(post.thread_id)
    board = Board.query.get(thread.board_id)
    membership_check = check_board_membership(board, current_user)
    if "errors" in membership_check:
        return membership_check
    return {"post": post.to_dict(), "thread": thread.to_dict(), "board": board.to_dict()}


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


@post_routes.route("/<int:post_id>", methods=["PUT"])
@login_required
def update_post(post_id):
    form = PostForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        post = Post.query.get(post_id)
        if not post:
            return {"errors": f"No post exists with ID: {post_id}"}, 400
        if post.owner_id != current_user.id:
            return {"errors": "You cannot edit a post that isn't yours."}, 401
        post.body = form.data["body"]
        post.last_edited = datetime.utcnow()
        db.session.add(post)
        db.session.commit()
        return post.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}, 400


@post_routes.route("/<int:post_id>", methods=["DELETE"])
@login_required
def delete_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return {"errors": f"No post exists with ID: {post_id}"}, 400
    thread = Thread.query.get(post.thread_id)
    board = Board.query.get(thread.board_id)
    if post.owner_id == current_user.id or board.owner_id == current_user.id:
        db.session.delete(post)
        if len(Post.query.filter(Post.thread_id == thread.id).all()) == 0:
            db.session.delete(thread)
        db.session.commit()
        return post.to_dict()
    return {"errors": "You must be the owner of a post or the board it is in to delete it."}, 400
