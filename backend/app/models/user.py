from pydantic import BaseModel
from typing import Optional


class UserRegister(BaseModel):
    email: str
    password: str
    username: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserProfileUpdate(BaseModel):
    username: Optional[str] = None
    location: Optional[str] = None
    profile_image: Optional[str] = None


class UserProfileResponse(BaseModel):
    id: str
    username: str
    email: str
    location: Optional[str] = None
    plan: str = "free"
    avatar_color: str = "#FF6B6B"
    profile_image: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfileResponse
