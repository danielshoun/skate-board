import string
from random import choice


def generate_token(length):
    return "".join([choice(string.ascii_letters + string.digits) for _ in range(length)])
