from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, Length


class PostForm(FlaskForm):
    thread_id = IntegerField('thread_id', validators=[DataRequired()])
    body = StringField('body', validators=[DataRequired(), Length(1, 4096)])
