from fastapi import APIRouter, HTTPException, Depends
from typing import List

from app.models.item import ItemResponse, ItemStatus
from app.database import db
from app.dependencies import get_current_user

router = APIRouter(prefix="/favorites", tags=["Favoriten"])


def item_to_response(item: dict) -> ItemResponse:
    return ItemResponse(
        id=item["id"],
        title=item["title"],
        size=item["size"],
        brand=item["brand"],
        condition=item["condition"],
        owner_id=item["owner_id"],
        owner_name=item["owner_name"],
        location=item["location"],
        distance=item.get("distance"),
        avatar_color=item.get("avatar_color", "#4ECDC4"),
        image=item.get("image"),
        status=item.get("status", ItemStatus.available),
    )


@router.get("", response_model=List[ItemResponse])
async def get_favorites(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    liked_ids = db.likes.get(user_id, [])
    return [item_to_response(db.items[iid]) for iid in liked_ids if iid in db.items]


@router.delete("/{item_id}", status_code=204)
async def remove_favorite(item_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    liked = db.likes.get(user_id, [])
    if item_id not in liked:
        raise HTTPException(status_code=404, detail="Favorit nicht gefunden")
    db.likes[user_id].remove(item_id)
