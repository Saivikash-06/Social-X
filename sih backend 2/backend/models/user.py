"""User models and authentication request/response schemas."""

from typing import Optional, List
from datetime import datetime, timezone
from uuid import uuid4
from pydantic import BaseModel, EmailStr, Field

try:
    from backend.shared.enums.civic import StakeholderRole
except ImportError:
    from shared.enums.civic import StakeholderRole


class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    name: str = Field(..., min_length=2)
    role: str = Field(
        "CITIZEN",
        description="Role: CITIZEN, STUDENT, FACULTY, INDUSTRY, GOVERNMENT, or ADMIN"
    )
    phone_number: Optional[str] = None
    department: Optional[str] = None
    university: Optional[str] = None
    company_name: Optional[str] = None


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class GoogleLoginRequest(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    token: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    firebase_uid: Optional[str] = None
    photo_url: Optional[str] = None
    phone_number: Optional[str] = None
    department: Optional[str] = None
    university: Optional[str] = None
    company_name: Optional[str] = None
    is_active: bool = True
    email_verified: bool = False
    created_at: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class UserInDB(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    email: str
    name: str
    role: str
    hashed_password: str
    firebase_uid: Optional[str] = None
    photo_url: Optional[str] = None
    phone_number: Optional[str] = None
    department: Optional[str] = None
    university: Optional[str] = None
    company_name: Optional[str] = None
    is_active: bool = True
    email_verified: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
