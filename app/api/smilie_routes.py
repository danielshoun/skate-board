from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Board, db, Thread, Post, Smilie
from app.forms import SmilieForm
from app.utils import validation_errors_to_error_messages, aws
from sqlalchemy import or_

smilie_routes = Blueprint("smilies", __name__)


@smilie_routes.route("/<int:board_id>")
def get_smilies(board_id):
    smilies = Smilie.query.filter(or_(Smilie.board_id == board_id, Smilie.board_id == None)).all()
    return jsonify([smilie.to_dict() for smilie in smilies])


@smilie_routes.route("", methods=["POST"])
@login_required
def create_smilie():
    form = SmilieForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        board = Board.query.get(form.data["board_id"])
        if not board:
            return {"errors": f"No post exists with ID: {form.data['board_id']}"}, 400
        if not (board.owner_id == current_user.id):
            return {"errors": "You must be the owner of a board to add smilies."}, 400
        image = request.files["image"]
        image.filename = aws.get_unique_filename(image.filename)
        print(image)
        upload = aws.upload_file_to_s3(image)
        if "url" not in upload:
            return upload, 400
        url = upload["url"]
        smilie = Smilie(
            name=f":{form.data['name']}:",
            url=url,
            board_id=form.data['board_id']
        )
        db.session.add(smilie)
        db.session.commit()
        return smilie.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}, 400


@smilie_routes.route("/<int:smilie_id>", methods=["PUT"])
@login_required
def update_smilie(smilie_id):
    form = SmilieForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        smilie = Smilie.query.get(smilie_id)
        board = Board.query.get(smilie.board_id)
        if not (board.owner_id == current_user.id):
            return {"errors": "You must be the owner of a board to add smilies."}, 400
        smilie.name = f":{form.data['name']}:"
        db.session.add(smilie)
        db.session.commit()
        return smilie.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}, 400


@smilie_routes.route("/<int:smilie_id>", methods=["DELETE"])
@login_required
def delete_smilie(smilie_id):
    smilie = Smilie.query.get(smilie_id)
    if not smilie:
        return {"errors": f"No smilie exists with ID: {smilie_id}"}, 400
    board = Board.query.get(smilie.board_id)
    if not board:
        return {"errors": "Default smilies cannot be deleted."}, 400
    if not (board.owner_id == current_user.id):
        return {"errors": "You must be the owner of a board to delete smilies."}, 400
    db.session.delete(smilie)
    db.session.commit()
    return smilie.to_dict()
