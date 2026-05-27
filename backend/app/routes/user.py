from fastapi import APIRouter, Depends

from app.models.user import UserProfileResponse, UserProfileUpdate
from app.database import db
from app.dependencies import get_current_user

router = APIRouter(prefix="/user", tags=["Benutzer"])


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


@router.get("/profile", response_model=UserProfileResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return user_to_profile(current_user)


@router.put("/profile", response_model=UserProfileResponse)
async def update_profile(
    data: UserProfileUpdate,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["id"]

    if data.username is not None:
        db.users[user_id]["username"] = data.username
        # Update name on all owned items
        for item in db.items.values():
            if item["owner_id"] == user_id:
                item["owner_name"] = data.username

    if data.location is not None:
        db.users[user_id]["location"] = data.location
        for item in db.items.values():
            if item["owner_id"] == user_id:
                item["location"] = data.location

    if data.profile_image is not None:
        db.users[user_id]["profile_image"] = data.profile_image

    return user_to_profile(db.users[user_id])
