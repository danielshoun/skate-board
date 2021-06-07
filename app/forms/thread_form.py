from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField
from wtforms.validators import DataRequired, Length


class ThreadForm(FlaskForm):
    title = StringField("name", validators=[DataRequired(), Length(1, 128)])
    pinned = BooleanField("pinned")
    locked = BooleanField("locked")
    board_id = IntegerField("board_id", validators=[DataRequired()])
    first_post_body = StringField("first_post_body", validators=[DataRequired(), Length(1, 4096)])
