from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from jose import jwt
import uuid
import random

from app.models.user import UserRegister, UserLogin, TokenResponse, UserProfileResponse
from app.database import db, hash_password, verify_password
from app.dependencies import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_DAYS

router = APIRouter(prefix="/auth", tags=["Authentifizierung"])

AVATAR_COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"]


def create_access_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    return jwt.encode({"sub": user_id, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def user_to_profile(user: dict) -> UserProfileResponse:
    return UserProfileResponse(
        id=user["id"],
        username=user["username"],
        email=user["email"],
        location=user.get("location"),
        plan=user.get("plan", "free"),
        avatar_color=user.get("avatar_color", "#FF6B6B"),
        profile_image=user.get("profile_image"),
    )


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(data: UserRegister):
    for user in db.users.values():
        if user["email"] == data.email:
            raise HTTPException(status_code=400, detail="E-Mail bereits registriert")

    user_id = str(uuid.uuid4())
    db.users[user_id] = {
        "id": user_id,
        "email": data.email,
        "username": data.username,
        "password_hash": hash_password(data.password),
        "location": "Wien",
        "plan": "free",
        "avatar_color": random.choice(AVATAR_COLORS),
        "profile_image": None,
    }
    db.likes[user_id] = []
    db.dislikes[user_id] = []

    return TokenResponse(
        access_token=create_access_token(user_id),
        user=user_to_profile(db.users[user_id]),
    )


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):
    user = next((u for u in db.users.values() if u["email"] == data.email), None)

    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="E-Mail oder Passwort falsch")

    return TokenResponse(
        access_token=create_access_token(user["id"]),
        user=user_to_profile(user),
    )
