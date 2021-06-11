from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FileField
from wtforms.validators import DataRequired, Length, ValidationError, StopValidation
from PIL import Image, UnidentifiedImageError
from app.models import Smilie
from sqlalchemy import and_


def check_dimensions(_form, field):
    img = Image.open(field.data.stream)
    width, height = img.size
    print(f"Width: {width} pixels, Height: {height} pixels")
    if width > 80 or height > 32:
        raise ValidationError("Image size must be less than 80x32 pixels.")
    field.data.stream.seek(0)


def check_filetype(_form, field):
    try:
        img = Image.open(field.data.stream)
        format = img.format
        if not (format == "JPEG" or format == "GIF" or format == "PNG"):
            raise ValidationError("Image must be a JPEG, PNG, or GIF.")
        field.data.stream.seek(0)
    except UnidentifiedImageError:
        raise StopValidation("File is not an image.")


def smilie_exists_in_board(form, field):
    defaultSmilie = Smilie.query.filter(and_(Smilie.name == f":{field.data}:", Smilie.board_id == None))
    customSmilie = Smilie.query.filter(
        and_(Smilie.name == f":{field.data}:", Smilie.board_id == form.data["board_id"])
        ).first()
    if defaultSmilie or customSmilie:
        raise ValidationError("Name already exists in board.")


def smilie_contains_colon(_form, field):
    if ":" in field.data:
        raise ValidationError("Name cannot contain colons.")


class SmilieForm(FlaskForm):
    name = StringField(
        "name",
        validators=[DataRequired(), Length(1, 16, "Board name is too long. (Max 32 characters)"), smilie_contains_colon,
                    smilie_exists_in_board]
    )
    image = FileField("image", validators=[check_filetype, check_dimensions])
    board_id = IntegerField("board_id", validators=[DataRequired()])
