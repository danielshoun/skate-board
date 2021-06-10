from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FileField
from wtforms.validators import DataRequired, Length, ValidationError, StopValidation
from PIL import Image, UnidentifiedImageError
from app.models import Smilie


def check_dimensions(_form, field):
    img = Image.open(field.data.stream)
    width, height = img.size
    print(f"Width: {width} pixels, Height: {height} pixels")
    if width > 80 or height > 32:
        raise ValidationError("Image size must be less than 80x32 pixels.")


def check_filetype(_form, field):
    try:
        img = Image.open(field.data.stream)
        if not (img.format == "JPEG" or img.format == "GIF" or img.format == "PNG"):
            raise ValidationError("Image must be a JPEG, PNG, or GIF.")
    except UnidentifiedImageError:
        raise StopValidation("File is not an image.")


class SmilieForm(FlaskForm):
    name = StringField(
        "name", validators=[DataRequired(), Length(1, 16, "Board name is too long. (Max 32 characters)")]
    )
    image = FileField("image", validators=[check_filetype, check_dimensions])
    board_id = IntegerField("board_id", validators=[DataRequired()])
