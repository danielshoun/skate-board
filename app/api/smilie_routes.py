from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Board, db, Thread, Post, Smilie
from sqlalchemy import or_

smilie_routes = Blueprint("smilies", __name__)


@smilie_routes.route("/<int:board_id>")
def get_smilies(board_id):
    smilies = Smilie.query.filter(or_(Smilie.board_id == board_id, Smilie.board_id == None)).all()
    return jsonify([smilie.to_dict() for smilie in smilies])


@smilie_routes.route("/")
@login_required
def create_smilie():
    board = Board.query.get(request.json["board_id"])
    if not board:
        return {"errors": f"No post exists with ID: {request.json['board_id']}"}, 400
    if not (board.owner_id == current_user.id):
        return {"errors": "You must be the owner of a board to add smilies."}, 400
    print(request.files)
