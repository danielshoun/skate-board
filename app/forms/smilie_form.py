from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FileField
from wtforms.validators import DataRequired, Length, ValidationError, StopValidation
from PIL import Image, UnidentifiedImageError
from app.models import Smilie
from sqlalchemy import and_


def check_dimensions(form, field):
    if not form.data["is_update"]:
        img = Image.open(field.data.stream)
        width, height = img.size
        print(f"Width: {width} pixels, Height: {height} pixels")
        if width > 128 or height > 32:
            raise ValidationError("Image size must be less than 128x32 pixels.")
        field.data.stream.seek(0)


def check_filetype(form, field):
    if not form.data["is_update"]:
        try:
            img = Image.open(field.data.stream)
            format = img.format
            if not (format == "JPEG" or format == "GIF" or format == "PNG"):
                raise ValidationError("Image must be a JPEG, PNG, or GIF.")
            field.data.stream.seek(0)
        except UnidentifiedImageError:
            raise StopValidation("File is not an image.")


def smilie_exists_in_board(form, field):
    defaultSmilie = Smilie.query.filter(and_(Smilie.name == f":{field.data}:", Smilie.board_id == None)).all()
    customSmilie = Smilie.query.filter(
        and_(Smilie.name == f":{field.data}:", Smilie.board_id == form.data["board_id"])
    ).first()
    if defaultSmilie or (customSmilie and not (form.data["is_update"] == customSmilie.id)):
        raise ValidationError("Name already exists in board.")


def smilie_contains_colon(_form, field):
    if ":" in field.data:
        raise ValidationError("Name cannot contain colons.")


def required_if_not_edit(form, field):
    if not form.data["is_update"] and not field.data:
        raise StopValidation("You must select a file.")


class SmilieForm(FlaskForm):
    name = StringField(
        "name",
        validators=[DataRequired(), Length(1, 16, "Smilie is too long. (Max 16 characters)"), smilie_contains_colon,
                    smilie_exists_in_board]
    )
    image = FileField("image", validators=[required_if_not_edit, check_filetype, check_dimensions])
    board_id = IntegerField("board_id", validators=[])
    is_update = IntegerField("is_update")
