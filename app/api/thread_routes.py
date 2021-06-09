from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Board, db, Thread, Post, Smilie
from app.utils import validation_errors_to_error_messages, check_board_membership
from app.forms import ThreadForm
from datetime import datetime
from sqlalchemy import or_

thread_routes = Blueprint("threads", __name__)


@thread_routes.route("/<int:thread_id>")
def get_thread(thread_id):
    thread = Thread.query.get(thread_id)
    if not thread:
        return {"errors": f"No thread exists with ID: {thread_id}"}, 404
    board = Board.query.get(thread.board_id)
    membership_check = check_board_membership(board, current_user)
    if "errors" in membership_check:
        return membership_check
    queries = [Post.thread_id == thread_id]
    if request.args.get("search"):
        queries.append(Post.body.ilike(f"%{request.args.get('search')}%"))
    posts = db.session \
        .query(Post) \
        .filter(*queries) \
        .order_by(Post.created_at) \
        .paginate(page=request.args.get("page", default=1, type=int), per_page=40)
    smilies = db.session \
        .query(Smilie) \
        .filter(or_(Smilie.board_id == board.id, Smilie.board_id == None)) \
        .order_by(Smilie.board_id, Smilie.name) \
        .all()
    print(smilies)
    return {
        "board": board.to_dict(),
        "smilies": [smilie.to_dict() for smilie in smilies],
        "thread": thread.to_dict(),
        "posts": [post.to_dict() for post in posts.items],
        "page_count": posts.pages
    }


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


@thread_routes.route("/<int:thread_id>", methods=["PUT"])
@login_required
def update_thread(thread_id):
    form = ThreadForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        thread = Thread.query.get(thread_id)
        post = Post.query.filter(Post.thread_id == thread_id).order_by(Post.id).first()
        board = Board.query.get(form.data["board_id"])
        if not thread:
            return {"errors": f"No thread exists with ID: {thread_id}"}, 400
        if thread.owner_id != current_user.id:
            return {"errors": "You must be the owner of a thread to edit it."}, 401
        if board.owner_id != current_user.id and (form.data["pinned"] or form.data["locked"]):
            return {"errors": "You must be the board owner to pin or lock threads."}, 401
        thread.title = form.data["title"]
        thread.pinned = form.data["pinned"]
        thread.locked = form.data["locked"]
        post.body = form.data["first_post_body"]
        post.last_edited = datetime.utcnow()
        db.session.add(thread)
        db.session.add(post)
        db.session.commit()
        return thread.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}, 400


@thread_routes.route("/<int:thread_id>", methods=["DELETE"])
@login_required
def delete_thread(thread_id):
    thread = Thread.query.get(thread_id)
    if not thread:
        return {"errors": f"No thread exists with ID: {thread_id}"}, 400
    board = Board.query.get(thread.board_id)
    if thread.owner_id == current_user.id or board.owner_id == current_user.id:
        Post.query.filter(Post.thread_id == thread_id).delete()
        db.session.delete(thread)
        db.session.commit()
        return thread.to_dict()
    return {"errors": "You must be the owner of a thread or the board it is in to delete it."}
