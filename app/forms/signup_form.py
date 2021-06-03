from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import User


def user_exists(form, field):
    print("Checking if user exits", field.data)
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError("User is already registered.")


class SignUpForm(FlaskForm):
    username = StringField('username', validators=[DataRequired(), Length(1, 16, "Username is too long.")])
    email = StringField(
        'email', validators=[DataRequired(), user_exists, Email(), Length(1, 256, "Email is too long.")]
        )
    password = StringField('password', validators=[DataRequired()])
