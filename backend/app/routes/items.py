from fastapi import APIRouter, HTTPException, Depends
from typing import List
import uuid

from app.models.item import ItemCreate, ItemResponse, ItemStatusUpdate, ItemStatus
from app.database import db
from app.dependencies import get_current_user

router = APIRouter(prefix="/items", tags=["Kleidungsstücke"])


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
async def get_swipe_feed(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    seen = set(db.likes.get(user_id, []) + db.dislikes.get(user_id, []))

    feed = [
        item_to_response(item)
        for item in db.items.values()
        if item["owner_id"] != user_id
        and item["id"] not in seen
        and item.get("status", "Verfügbar") == "Verfügbar"
    ]
    return feed


@router.get("/mine", response_model=List[ItemResponse])
async def get_my_items(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    return [item_to_response(item) for item in db.items.values() if item["owner_id"] == user_id]


@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: str, current_user: dict = Depends(get_current_user)):
    item = db.items.get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Kleidungsstück nicht gefunden")
    return item_to_response(item)


@router.post("", response_model=ItemResponse, status_code=201)
async def create_item(data: ItemCreate, current_user: dict = Depends(get_current_user)):
    item_id = str(uuid.uuid4())
    item = {
        "id": item_id,
        "title": data.title,
        "size": data.size,
        "brand": data.brand,
        "condition": data.condition,
        "owner_id": current_user["id"],
        "owner_name": current_user["username"],
        "location": current_user.get("location", "Wien"),
        "distance": None,
        "avatar_color": current_user.get("avatar_color", "#FF6B6B"),
        "image": data.image,
        "status": "Verfügbar",
    }
    db.items[item_id] = item
    return item_to_response(item)


@router.put("/{item_id}", response_model=ItemResponse)
async def update_item_status(
    item_id: str,
    data: ItemStatusUpdate,
    current_user: dict = Depends(get_current_user),
):
    item = db.items.get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Kleidungsstück nicht gefunden")
    if item["owner_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Keine Berechtigung")

    db.items[item_id]["status"] = data.status
    return item_to_response(db.items[item_id])


@router.delete("/{item_id}", status_code=204)
async def delete_item(item_id: str, current_user: dict = Depends(get_current_user)):
    item = db.items.get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Kleidungsstück nicht gefunden")
    if item["owner_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Keine Berechtigung")

    del db.items[item_id]


@router.post("/{item_id}/like", status_code=200)
async def like_item(item_id: str, current_user: dict = Depends(get_current_user)):
    if not db.items.get(item_id):
        raise HTTPException(status_code=404, detail="Kleidungsstück nicht gefunden")

    user_id = current_user["id"]
    if user_id not in db.likes:
        db.likes[user_id] = []
    if item_id not in db.likes[user_id]:
        db.likes[user_id].append(item_id)

    db.dislikes.setdefault(user_id, [])
    if item_id in db.dislikes[user_id]:
        db.dislikes[user_id].remove(item_id)

    return {"message": "Gefällt mir gespeichert"}


@router.post("/{item_id}/dislike", status_code=200)
async def dislike_item(item_id: str, current_user: dict = Depends(get_current_user)):
    if not db.items.get(item_id):
        raise HTTPException(status_code=404, detail="Kleidungsstück nicht gefunden")

    user_id = current_user["id"]
    db.dislikes.setdefault(user_id, [])
    if item_id not in db.dislikes[user_id]:
        db.dislikes[user_id].append(item_id)

    db.likes.setdefault(user_id, [])
    if item_id in db.likes[user_id]:
        db.likes[user_id].remove(item_id)

    return {"message": "Nicht interessiert gespeichert"}
