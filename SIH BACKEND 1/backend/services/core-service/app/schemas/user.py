from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from shared.constants.roles import RoleEnum
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    organization_name: Optional[str] = None
    department: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: RoleEnum = RoleEnum.CITIZEN

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    organization_name: Optional[str] = None
    department: Optional[str] = None

class UserResponse(UserBase):
    id: str
    role: RoleEnum
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
