import string
from random import choice


def validation_errors_to_error_messages(validation_errors):
    errorMessages = {}
    for field in validation_errors:
        errorMessages[field] = []
        for error in validation_errors[field]:
            errorMessages[field].append(f"{error}")
    return errorMessages


def generate_token(length):
    return "".join([choice(string.ascii_letters + string.digits) for _ in range(length)])
