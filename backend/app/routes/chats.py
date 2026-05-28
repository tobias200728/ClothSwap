from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
import uuid

from app.models.chat import ChatCreate, ChatResponse, MessageCreate, MessageResponse
from app.dependencies import get_current_user
from app.supabase_client import supabase

router = APIRouter(prefix="/chats", tags=["Chats"])


def message_to_response(msg: dict) -> MessageResponse:
    return MessageResponse(
        id=msg["id"],
        sender_id=msg["sender_id"],
        text=msg["text"],
        time=msg.get("time", ""),
    )


def _fetch_profile_images(user_ids: list) -> dict:
    if not user_ids:
        return {}
    res = supabase.table("users").select("id, profile_image").in_("id", user_ids).execute()
    return {u["id"]: u.get("profile_image") for u in res.data}


def build_chat_response(
    chat: dict,
    participants: list,
    current_user_id: str,
    messages: list = None,
    profile_images: dict = None,
) -> ChatResponse:
    other = next((p for p in participants if p["user_id"] != current_user_id), None)
    me = next((p for p in participants if p["user_id"] == current_user_id), None)

    other_user_id = other["user_id"] if other else None
    other_profile_image = (profile_images or {}).get(other_user_id) if other_user_id else None

    return ChatResponse(
        id=chat["id"],
        name=other["name"] if other else "Unbekannt",
        item=chat.get("item_title", ""),
        avatar_color=other["avatar_color"] if other else "#4ECDC4",
        unread_count=me["unread_count"] if me else 0,
        last_message=chat.get("last_message", ""),
        time=chat.get("time", ""),
        messages=[message_to_response(m) for m in (messages or [])],
        other_user_id=other_user_id,
        other_profile_image=other_profile_image,
    )


@router.get("", response_model=List[ChatResponse])
async def get_chats(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]

    parts = supabase.table("chat_participants").select("chat_id").eq("user_id", user_id).execute()
    chat_ids = [p["chat_id"] for p in parts.data]
    if not chat_ids:
        return []

    chats_res = supabase.table("chats").select("*").in_("id", chat_ids).execute()
    all_parts = supabase.table("chat_participants").select("*").in_("chat_id", chat_ids).execute()

    other_ids = list({p["user_id"] for p in all_parts.data if p["user_id"] != user_id})
    profile_images = _fetch_profile_images(other_ids)

    result = []
    for chat in chats_res.data:
        participants = [p for p in all_parts.data if p["chat_id"] == chat["id"]]
        result.append(build_chat_response(chat, participants, user_id, profile_images=profile_images))
    return result


@router.get("/{chat_id}", response_model=ChatResponse)
async def get_chat(chat_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]

    auth_check = supabase.table("chat_participants").select("user_id").eq("chat_id", chat_id).eq("user_id", user_id).execute()
    if not auth_check.data:
        raise HTTPException(status_code=403, detail="Keine Berechtigung")

    chat_res = supabase.table("chats").select("*").eq("id", chat_id).maybe_single().execute()
    if not chat_res.data:
        raise HTTPException(status_code=404, detail="Chat nicht gefunden")

    participants = supabase.table("chat_participants").select("*").eq("chat_id", chat_id).execute().data
    messages = supabase.table("messages").select("*").eq("chat_id", chat_id).order("created_at").execute().data

    other_ids = [p["user_id"] for p in participants if p["user_id"] != user_id]
    profile_images = _fetch_profile_images(other_ids)

    return build_chat_response(chat_res.data, participants, user_id, messages, profile_images)


@router.post("", response_model=ChatResponse, status_code=201)
async def create_chat(data: ChatCreate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]

    if data.recipient_id == user_id:
        raise HTTPException(status_code=400, detail="Du kannst dir selbst nicht schreiben")

    recipient_res = supabase.table("users").select("*").eq("id", data.recipient_id).maybe_single().execute()
    if not recipient_res.data:
        raise HTTPException(status_code=404, detail="Empfänger nicht gefunden")

    item_res = supabase.table("items").select("*").eq("id", data.item_id).maybe_single().execute()
    if not item_res.data:
        raise HTTPException(status_code=404, detail="Kleidungsstück nicht gefunden")

    recipient = recipient_res.data
    item = item_res.data

    my_chat_ids = {p["chat_id"] for p in supabase.table("chat_participants").select("chat_id").eq("user_id", user_id).execute().data}
    their_chat_ids = {p["chat_id"] for p in supabase.table("chat_participants").select("chat_id").eq("user_id", data.recipient_id).execute().data}
    common = my_chat_ids & their_chat_ids

    for cid in common:
        existing = supabase.table("chats").select("*").eq("id", cid).eq("item_id", data.item_id).execute()
        if existing.data:
            participants = supabase.table("chat_participants").select("*").eq("chat_id", cid).execute().data
            messages = supabase.table("messages").select("*").eq("chat_id", cid).order("created_at").execute().data
            other_ids = [p["user_id"] for p in participants if p["user_id"] != user_id]
            profile_images = _fetch_profile_images(other_ids)
            return build_chat_response(existing.data[0], participants, user_id, messages, profile_images)

    now = datetime.now().strftime("%H:%M")
    chat_id = str(uuid.uuid4())

    supabase.table("chats").insert({
        "id": chat_id,
        "item_id": data.item_id,
        "item_title": item["title"],
        "last_message": data.initial_message,
        "time": now,
    }).execute()

    supabase.table("chat_participants").insert([
        {
            "chat_id": chat_id,
            "user_id": user_id,
            "name": current_user["username"],
            "avatar_color": current_user.get("avatar_color", "#FF6B6B"),
            "unread_count": 0,
        },
        {
            "chat_id": chat_id,
            "user_id": data.recipient_id,
            "name": recipient["username"],
            "avatar_color": recipient.get("avatar_color", "#4ECDC4"),
            "unread_count": 1,
        },
    ]).execute()

    supabase.table("messages").insert({
        "id": str(uuid.uuid4()),
        "chat_id": chat_id,
        "sender_id": user_id,
        "text": data.initial_message,
        "time": now,
    }).execute()

    chat_res = supabase.table("chats").select("*").eq("id", chat_id).maybe_single().execute()
    participants = supabase.table("chat_participants").select("*").eq("chat_id", chat_id).execute().data
    messages = supabase.table("messages").select("*").eq("chat_id", chat_id).order("created_at").execute().data
    profile_images = _fetch_profile_images([data.recipient_id])

    return build_chat_response(chat_res.data, participants, user_id, messages, profile_images)


@router.post("/{chat_id}/messages", response_model=MessageResponse, status_code=201)
async def send_message(
    chat_id: str,
    data: MessageCreate,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["id"]

    auth_check = supabase.table("chat_participants").select("user_id").eq("chat_id", chat_id).eq("user_id", user_id).execute()
    if not auth_check.data:
        raise HTTPException(status_code=403, detail="Keine Berechtigung")

    now = datetime.now().strftime("%H:%M")
    msg = {
        "id": str(uuid.uuid4()),
        "chat_id": chat_id,
        "sender_id": user_id,
        "text": data.text,
        "time": now,
    }
    msg_res = supabase.table("messages").insert(msg).execute()

    supabase.table("chats").update({"last_message": data.text, "time": now}).eq("id", chat_id).execute()

    other_parts = supabase.table("chat_participants").select("*").eq("chat_id", chat_id).neq("user_id", user_id).execute()
    for p in other_parts.data:
        supabase.table("chat_participants").update(
            {"unread_count": p["unread_count"] + 1}
        ).eq("chat_id", chat_id).eq("user_id", p["user_id"]).execute()

    return message_to_response(msg_res.data[0])


@router.put("/{chat_id}/read", status_code=200)
async def mark_as_read(chat_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    auth_check = supabase.table("chat_participants").select("user_id").eq("chat_id", chat_id).eq("user_id", user_id).execute()
    if not auth_check.data:
        raise HTTPException(status_code=403, detail="Keine Berechtigung")

    supabase.table("chat_participants").update({"unread_count": 0}).eq("chat_id", chat_id).eq("user_id", user_id).execute()
    return {"message": "Als gelesen markiert"}
