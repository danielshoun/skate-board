from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField
from wtforms.validators import DataRequired, Length, ValidationError
from app.models import Board


def board_exists(form, field):
    board = Board.query.filter(Board.name == field.data).first()
    if board and not (form.data["is_update"] == board.id):
        raise ValidationError("Board already exists with that name.")


class BoardForm(FlaskForm):
    name = StringField(
        "name", validators=[DataRequired(), Length(1, 32, "Board name is too long. (Max 32 characters)"), board_exists]
    )
    description = StringField(
        "description", validators=[Length(0, 256, "Board description is too long.  (Max 256 characters)")]
    )
    private = BooleanField("private")
    is_update = IntegerField("is_update")
