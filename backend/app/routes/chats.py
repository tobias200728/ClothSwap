from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
import uuid

from app.models.chat import ChatCreate, ChatResponse, MessageCreate, MessageResponse
from app.database import db
from app.dependencies import get_current_user

router = APIRouter(prefix="/chats", tags=["Chats"])


def message_to_response(msg: dict) -> MessageResponse:
    return MessageResponse(
        id=msg["id"],
        sender_id=msg["sender_id"],
        text=msg["text"],
        time=msg["time"],
    )


def chat_to_response(chat: dict, current_user_id: str, include_messages: bool = False) -> ChatResponse:
    # Immer den jeweils anderen Teilnehmer anzeigen
    other_id = next((p for p in chat["participant_ids"] if p != current_user_id), None)
    participant_info = chat.get("participant_info", {})
    other_info = participant_info.get(other_id, {}) if other_id else {}

    messages = [message_to_response(m) for m in chat.get("messages", [])] if include_messages else []
    return ChatResponse(
        id=chat["id"],
        name=other_info.get("name", "Unbekannt"),
        item=chat.get("item_title", ""),
        avatar_color=other_info.get("avatar_color", "#4ECDC4"),
        unread_count=chat.get("unread_count", 0),
        last_message=chat.get("last_message", ""),
        time=chat.get("time", ""),
        messages=messages,
    )


@router.get("", response_model=List[ChatResponse])
async def get_chats(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    return [
        chat_to_response(chat, user_id)
        for chat in db.chats.values()
        if user_id in chat.get("participant_ids", [])
    ]


@router.get("/{chat_id}", response_model=ChatResponse)
async def get_chat(chat_id: str, current_user: dict = Depends(get_current_user)):
    chat = db.chats.get(chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat nicht gefunden")
    if current_user["id"] not in chat.get("participant_ids", []):
        raise HTTPException(status_code=403, detail="Keine Berechtigung")

    return chat_to_response(chat, current_user["id"], include_messages=True)


@router.post("", response_model=ChatResponse, status_code=201)
async def create_chat(data: ChatCreate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]

    if data.recipient_id == user_id:
        raise HTTPException(status_code=400, detail="Du kannst dir selbst nicht schreiben")

    recipient = db.users.get(data.recipient_id)
    if not recipient:
        raise HTTPException(status_code=404, detail="Empfänger nicht gefunden")

    item = db.items.get(data.item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Kleidungsstück nicht gefunden")

    existing = next(
        (
            c for c in db.chats.values()
            if set(c.get("participant_ids", [])) == {user_id, data.recipient_id}
            and c.get("item_id") == data.item_id
        ),
        None,
    )
    if existing:
        return chat_to_response(existing, user_id, include_messages=True)

    now = datetime.now().strftime("%H:%M")
    chat_id = str(uuid.uuid4())

    db.chats[chat_id] = {
        "id": chat_id,
        "participant_ids": [user_id, data.recipient_id],
        "participant_info": {
            user_id: {
                "name": current_user["username"],
                "avatar_color": current_user.get("avatar_color", "#FF6B6B"),
            },
            data.recipient_id: {
                "name": recipient["username"],
                "avatar_color": recipient.get("avatar_color", "#4ECDC4"),
            },
        },
        "item_id": data.item_id,
        "item_title": item["title"],
        "unread_count": 1,
        "last_message": data.initial_message,
        "time": now,
        "messages": [
            {
                "id": str(uuid.uuid4()),
                "sender_id": user_id,
                "text": data.initial_message,
                "time": now,
            }
        ],
    }
    return chat_to_response(db.chats[chat_id], user_id, include_messages=True)


@router.post("/{chat_id}/messages", response_model=MessageResponse, status_code=201)
async def send_message(
    chat_id: str,
    data: MessageCreate,
    current_user: dict = Depends(get_current_user),
):
    chat = db.chats.get(chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat nicht gefunden")
    if current_user["id"] not in chat.get("participant_ids", []):
        raise HTTPException(status_code=403, detail="Keine Berechtigung")

    now = datetime.now().strftime("%H:%M")
    message = {
        "id": str(uuid.uuid4()),
        "sender_id": current_user["id"],
        "text": data.text,
        "time": now,
    }
    db.chats[chat_id]["messages"].append(message)
    db.chats[chat_id]["last_message"] = data.text
    db.chats[chat_id]["time"] = now
    db.chats[chat_id]["unread_count"] = db.chats[chat_id].get("unread_count", 0) + 1

    return message_to_response(message)


@router.put("/{chat_id}/read", status_code=200)
async def mark_as_read(chat_id: str, current_user: dict = Depends(get_current_user)):
    chat = db.chats.get(chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat nicht gefunden")
    if current_user["id"] not in chat.get("participant_ids", []):
        raise HTTPException(status_code=403, detail="Keine Berechtigung")

    db.chats[chat_id]["unread_count"] = 0
    return {"message": "Als gelesen markiert"}
