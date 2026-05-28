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
    description: Optional[str] = None
    image: Optional[str] = None


class ItemStatusUpdate(BaseModel):
    status: ItemStatus


class ItemUpdate(BaseModel):
    title: Optional[str] = None
    size: Optional[str] = None
    brand: Optional[str] = None
    condition: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    status: Optional[ItemStatus] = None


class ItemResponse(BaseModel):
    id: str
    title: str
    size: str
    brand: str
    condition: str
    description: Optional[str] = None
    owner_id: str
    owner_name: str
    owner_profile_image: Optional[str] = None
    location: str
    distance: Optional[str] = None
    avatar_color: str = "#4ECDC4"
    image: Optional[str] = None
    status: ItemStatus = ItemStatus.available
