from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr
from shared.enums import DepartmentType


class DepartmentBase(BaseModel):
    name: str = Field(..., description="Full department name")
    code: str = Field(..., description="Unique department code (e.g. PWD, BWSSB)")
    department_type: DepartmentType
    description: Optional[str] = None
    contact_email: EmailStr
    contact_phone: Optional[str] = None
    jurisdiction_level: str = "District"
    is_active: bool = True


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    jurisdiction_level: Optional[str] = None
    is_active: Optional[bool] = None


class DepartmentResponse(DepartmentBase):
    id: str
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}


class DistrictBase(BaseModel):
    state: str
    district_name: str
    district_code: str
    headquarters: Optional[str] = None
    taluks: List[str] = Field(default_factory=list)
    pincodes: List[str] = Field(default_factory=list)
    is_active: bool = True


class DistrictCreate(DistrictBase):
    pass


class DistrictUpdate(BaseModel):
    state: Optional[str] = None
    district_name: Optional[str] = None
    headquarters: Optional[str] = None
    taluks: Optional[List[str]] = None
    pincodes: Optional[List[str]] = None
    is_active: Optional[bool] = None


class DistrictResponse(DistrictBase):
    id: str
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}


class OfficeBase(BaseModel):
    department_id: str
    district_id: str
    office_name: str
    office_code: str
    address: Optional[str] = None
    officer_in_charge_name: str
    officer_in_charge_email: EmailStr
    officer_in_charge_phone: Optional[str] = None
    capacity: int = 50
    is_active: bool = True


class OfficeCreate(OfficeBase):
    pass


class OfficeUpdate(BaseModel):
    office_name: Optional[str] = None
    address: Optional[str] = None
    officer_in_charge_name: Optional[str] = None
    officer_in_charge_email: Optional[EmailStr] = None
    officer_in_charge_phone: Optional[str] = None
    capacity: Optional[int] = None
    is_active: Optional[bool] = None


class OfficeResponse(OfficeBase):
    id: str
    current_workload: int
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}
