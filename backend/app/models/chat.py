from pydantic import BaseModel
from typing import List, Optional


class MessageCreate(BaseModel):
    text: str


class MessageResponse(BaseModel):
    id: str
    sender_id: str
    text: str
    time: str


class ChatCreate(BaseModel):
    recipient_id: str
    item_id: str
    initial_message: str


class ChatResponse(BaseModel):
    id: str
    name: str
    item: str
    avatar_color: str
    unread_count: int
    last_message: str
    time: str
    messages: List[MessageResponse] = []
    other_user_id: Optional[str] = None
    other_profile_image: Optional[str] = None
