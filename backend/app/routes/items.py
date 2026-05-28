from fastapi import APIRouter, HTTPException, Depends
from typing import List
from pydantic import BaseModel
import uuid
import base64

from app.models.item import ItemCreate, ItemResponse, ItemStatusUpdate, ItemUpdate, ItemStatus
from app.dependencies import get_current_user
from app.supabase_client import supabase

router = APIRouter(prefix="/items", tags=["Kleidungsstücke"])

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
async def get_swipe_feed(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]

    likes_res = supabase.table("likes").select("item_id").eq("user_id", user_id).execute()
    dislikes_res = supabase.table("dislikes").select("item_id").eq("user_id", user_id).execute()
    seen_ids = {r["item_id"] for r in likes_res.data + dislikes_res.data}

    result = supabase.table("items").select(ITEMS_WITH_OWNER).neq("owner_id", user_id).eq("status", "Verfügbar").execute()
    return [item_to_response(item) for item in result.data if item["id"] not in seen_ids]


@router.get("/mine", response_model=List[ItemResponse])
async def get_my_items(current_user: dict = Depends(get_current_user)):
    result = supabase.table("items").select(ITEMS_WITH_OWNER).eq("owner_id", current_user["id"]).execute()
    return [item_to_response(item) for item in result.data]


@router.get("/by-user/{user_id}", response_model=List[ItemResponse])
async def get_items_by_user(user_id: str, current_user: dict = Depends(get_current_user)):
    result = supabase.table("items").select(ITEMS_WITH_OWNER).eq("owner_id", user_id).eq("status", "Verfügbar").execute()
    return [item_to_response(item) for item in result.data]


@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: str, current_user: dict = Depends(get_current_user)):
    result = supabase.table("items").select(ITEMS_WITH_OWNER).eq("id", item_id).maybe_single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Kleidungsstück nicht gefunden")
    return item_to_response(result.data)


@router.post("", response_model=ItemResponse, status_code=201)
async def create_item(data: ItemCreate, current_user: dict = Depends(get_current_user)):
    item = {
        "id": str(uuid.uuid4()),
        "title": data.title,
        "size": data.size,
        "brand": data.brand,
        "condition": data.condition,
        "description": data.description or "",
        "owner_id": current_user["id"],
        "owner_name": current_user["username"],
        "location": current_user.get("location", "Wien"),
        "distance": None,
        "avatar_color": current_user.get("avatar_color", "#FF6B6B"),
        "image": data.image,
        "status": "Verfügbar",
    }
    result = supabase.table("items").insert(item).execute()
    # Re-fetch with owner join to get profile_image
    created = supabase.table("items").select(ITEMS_WITH_OWNER).eq("id", result.data[0]["id"]).maybe_single().execute()
    return item_to_response(created.data)


class ImageUpload(BaseModel):
    base64: str
    filename: str
    content_type: str = "image/jpeg"


@router.post("/upload-image")
async def upload_image(
    data: ImageUpload,
    current_user: dict = Depends(get_current_user),
):
    file_bytes = base64.b64decode(data.base64)
    ext = data.filename.rsplit(".", 1)[-1].lower() if "." in data.filename else "jpg"
    file_name = f"{uuid.uuid4()}.{ext}"

    supabase.storage.from_("item-images").upload(
        file_name, file_bytes, {"content-type": data.content_type}
    )
    url = supabase.storage.from_("item-images").get_public_url(file_name)
    return {"url": url}


@router.put("/{item_id}", response_model=ItemResponse)
async def update_item_status(
    item_id: str,
    data: ItemStatusUpdate,
    current_user: dict = Depends(get_current_user),
):
    existing = supabase.table("items").select("owner_id").eq("id", item_id).maybe_single().execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Kleidungsstück nicht gefunden")
    if existing.data["owner_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Keine Berechtigung")

    supabase.table("items").update({"status": data.status}).eq("id", item_id).execute()
    updated = supabase.table("items").select(ITEMS_WITH_OWNER).eq("id", item_id).maybe_single().execute()
    return item_to_response(updated.data)


@router.patch("/{item_id}", response_model=ItemResponse)
async def update_item(
    item_id: str,
    data: ItemUpdate,
    current_user: dict = Depends(get_current_user),
):
    existing = supabase.table("items").select("owner_id").eq("id", item_id).maybe_single().execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Kleidungsstück nicht gefunden")
    if existing.data["owner_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Keine Berechtigung")

    update_data = {k: v for k, v in data.dict().items() if v is not None}
    if update_data:
        supabase.table("items").update(update_data).eq("id", item_id).execute()

    updated = supabase.table("items").select(ITEMS_WITH_OWNER).eq("id", item_id).maybe_single().execute()
    return item_to_response(updated.data)


@router.delete("/{item_id}", status_code=204)
async def delete_item(item_id: str, current_user: dict = Depends(get_current_user)):
    existing = supabase.table("items").select("owner_id").eq("id", item_id).maybe_single().execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Kleidungsstück nicht gefunden")
    if existing.data["owner_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Keine Berechtigung")
    supabase.table("items").delete().eq("id", item_id).execute()


@router.post("/{item_id}/like", status_code=200)
async def like_item(item_id: str, current_user: dict = Depends(get_current_user)):
    if not supabase.table("items").select("id").eq("id", item_id).execute().data:
        raise HTTPException(status_code=404, detail="Kleidungsstück nicht gefunden")
    user_id = current_user["id"]
    supabase.table("likes").upsert({"user_id": user_id, "item_id": item_id}).execute()
    supabase.table("dislikes").delete().eq("user_id", user_id).eq("item_id", item_id).execute()
    return {"message": "Gefällt mir gespeichert"}


@router.post("/{item_id}/dislike", status_code=200)
async def dislike_item(item_id: str, current_user: dict = Depends(get_current_user)):
    if not supabase.table("items").select("id").eq("id", item_id).execute().data:
        raise HTTPException(status_code=404, detail="Kleidungsstück nicht gefunden")
    user_id = current_user["id"]
    supabase.table("dislikes").upsert({"user_id": user_id, "item_id": item_id}).execute()
    supabase.table("likes").delete().eq("user_id", user_id).eq("item_id", item_id).execute()
    return {"message": "Nicht interessiert gespeichert"}
