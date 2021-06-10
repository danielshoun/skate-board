from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FileField
from wtforms.validators import DataRequired, Length, ValidationError
from app.models import Smilie


class SmilieForm(FlaskForm):
    name = StringField(
        "name", validators=[DataRequired(), Length(1, 16, "Board name is too long. (Max 32 characters)")]
    )
    image = FileField("image")
    board_id = IntegerField("board_id", validators=[DataRequired()])
