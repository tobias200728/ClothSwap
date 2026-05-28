from fastapi import APIRouter, HTTPException, Depends
from typing import List

from app.models.item import ItemResponse, ItemStatus
from app.dependencies import get_current_user
from app.supabase_client import supabase

router = APIRouter(prefix="/favorites", tags=["Favoriten"])

ITEMS_WITH_OWNER = "*, users!owner_id(profile_image)"


def item_to_response(item: dict) -> ItemResponse:
    owner_data = item.get("users") or {}
    return ItemResponse(
        id=item["id"],
        title=item["title"],
        size=item["size"],
        brand=item["brand"],
        condition=item["condition"],
        description=item.get("description"),
        owner_id=item["owner_id"],
        owner_name=item["owner_name"],
        owner_profile_image=owner_data.get("profile_image"),
        location=item["location"],
        distance=item.get("distance"),
        avatar_color=item.get("avatar_color", "#4ECDC4"),
        image=item.get("image"),
        status=item.get("status", ItemStatus.available),
    )


@router.get("", response_model=List[ItemResponse])
async def get_favorites(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    likes = supabase.table("likes").select("item_id").eq("user_id", user_id).execute()
    item_ids = [r["item_id"] for r in likes.data]
    if not item_ids:
        return []
    items = supabase.table("items").select(ITEMS_WITH_OWNER).in_("id", item_ids).execute()
    return [item_to_response(item) for item in items.data]


@router.delete("/{item_id}", status_code=204)
async def remove_favorite(item_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    existing = supabase.table("likes").select("item_id").eq("user_id", user_id).eq("item_id", item_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Favorit nicht gefunden")
    supabase.table("likes").delete().eq("user_id", user_id).eq("item_id", item_id).execute()
