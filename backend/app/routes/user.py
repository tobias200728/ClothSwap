from fastapi import APIRouter, Depends

from app.models.user import UserProfileResponse, UserProfileUpdate
from app.dependencies import get_current_user
from app.supabase_client import supabase

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
    update_data = {}

    if data.username is not None:
        update_data["username"] = data.username
        supabase.table("items").update({"owner_name": data.username}).eq("owner_id", user_id).execute()

    if data.location is not None:
        update_data["location"] = data.location
        supabase.table("items").update({"location": data.location}).eq("owner_id", user_id).execute()

    if data.profile_image is not None:
        update_data["profile_image"] = data.profile_image

    if update_data:
        supabase.table("users").update(update_data).eq("id", user_id).execute()

    result = supabase.table("users").select("*").eq("id", user_id).maybe_single().execute()
    return user_to_profile(result.data)
