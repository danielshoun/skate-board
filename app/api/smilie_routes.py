from flask import Blueprint, request, jsonify
from app.models import Board, db, Thread, Post, Smilie
from sqlalchemy import or_

smilie_routes = Blueprint("smilies", __name__)


@smilie_routes.route("/<int:board_id>")
def get_smilies(board_id):
    smilies = Smilie.query.filter(or_(Smilie.board_id == board_id, Smilie.board_id == None)).all()
    return jsonify([smilie.to_dict() for smilie in smilies])
