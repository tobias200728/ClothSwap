import hashlib
import os


def hash_password(password: str) -> str:
    salt = os.urandom(16).hex()
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 260000).hex()
    return f"{salt}${hashed}"


def verify_password(password: str, stored: str) -> bool:
    salt, hashed = stored.split("$", 1)
    check = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 260000).hex()
    return check == hashed
