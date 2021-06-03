from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField
from wtforms.validators import DataRequired, Length, ValidationError
from app.models import Board


def board_exists(_form, field):
    board = Board.query.filter(Board.name == field.data).first()
    if board:
        raise ValidationError("Board already exists with that name.")


class BoardForm(FlaskForm):
    name = StringField("name", validators=[DataRequired(), Length(1, 32, "Board name is too long."), board_exists])
    description = StringField("description", validators=[Length(0, 256)])
    private = BooleanField("private")
