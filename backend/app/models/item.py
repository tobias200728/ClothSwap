from pydantic import BaseModel
from typing import Optional
from enum import Enum


class ItemStatus(str, Enum):
    available = "Verfügbar"
    reserved = "Reserviert"
    swapped = "Getauscht"


class ItemCreate(BaseModel):
    title: str
    size: str
    brand: str
    condition: str
    image: Optional[str] = None


class ItemStatusUpdate(BaseModel):
    status: ItemStatus


class ItemResponse(BaseModel):
    id: str
    title: str
    size: str
    brand: str
    condition: str
    owner_id: str
    owner_name: str
    location: str
    distance: Optional[str] = None
    avatar_color: str = "#4ECDC4"
    image: Optional[str] = None
    status: ItemStatus = ItemStatus.available
