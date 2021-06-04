from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Board, db
from app.forms import BoardForm
from app.utils import validation_errors_to_error_messages, check_board_membership
from sqlalchemy import not_, func, desc

board_routes = Blueprint("boards", __name__)


@board_routes.route("")
def get_public_boards():
    queries = [not_(Board.private)]
    if request.args.get("search"):
        queries.append(Board.name.ilike(f"%{request.args.get('search')}%"))
    boards = db.session\
        .query(Board, func.count("memberships.board_id").label("member_count"))\
        .join("members")\
        .group_by(Board)\
        .filter(*queries)\
        .order_by(desc("member_count"))\
        .paginate(page=request.args.get("page", default=1, type=int), max_per_page=10)
    result = {"boards": [board.Board.to_dict() for board in boards.items], "page_count": boards.pages}
    return jsonify(result)


@board_routes.route("/joined")
@login_required
def get_joined_boards():
    return jsonify([board.to_dict() for board in current_user.boards_joined])


@board_routes.route("/owned")
@login_required
def get_owned_boards():
    return jsonify([board.to_dict() for board in current_user.boards_owned])


@board_routes.route("/<int:board_id>")
def get_board(board_id):
    board = Board.query.get(board_id)
    if not board:
        return {"errors": f"No board exists with ID: {board_id}"}, 404
    membership_check = check_board_membership(board, current_user)
    if "errors" in membership_check:
        return membership_check

    return board.to_dict()


@board_routes.route("", methods=["POST"])
@login_required
def create_board():
    form = BoardForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        board = Board(
            owner_id=current_user.id,
            name=form.data["name"],
            description=form.data["description"],
            private=form.data["private"]
        )
        board.members.append(current_user)
        db.session.add(board)
        db.session.commit()
        return board.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}


@board_routes.route("/<int:board_id>", methods=["PUT"])
@login_required
def update_board(board_id):
    form = BoardForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        board = Board.query.get(board_id)
        if not board:
            return {"errors": f"No board exists with ID: {board_id}"}, 404
        if board.owner_id != current_user.id:
            return {"errors": "You must be the owner of a board to edit it."}, 401
        board.name = form.data["name"]
        board.description = form.data["description"]
        board.private = form.data["private"]
        db.session.add(board)
        db.session.commit()
        return board.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}, 400


@board_routes.route("/<int:board_id>", methods=["DELETE"])
@login_required
def delete_board(board_id):
    board = Board.query.get(board_id)
    if not board:
        return {"errors": f"No board exists with ID: {board_id}"}, 404
    if board.owner_id == current_user.id:
        db.session.delete(board)
        db.session.commit()
        return board.to_dict()
    return {"errors": "You must be the owner of a board to delete it."}, 401
