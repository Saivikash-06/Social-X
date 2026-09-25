from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.repositories.department_repository import DepartmentRepository
from app.models.models import DepartmentModel, DistrictModel, OfficeModel
from app.schemas.department_schemas import (
    DepartmentCreate,
    DepartmentUpdate,
    DepartmentResponse,
    DistrictCreate,
    DistrictUpdate,
    DistrictResponse,
    OfficeCreate,
    OfficeUpdate,
    OfficeResponse,
)
from shared.responses import APIResponse
from shared.exceptions import EntityNotFoundError

router = APIRouter()


# ---------------- Departments ----------------
@router.get("/departments", response_model=APIResponse[List[DepartmentResponse]], summary="List all government departments")
async def list_departments(
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    db: AsyncSession = Depends(get_db),
):
    repo = DepartmentRepository(db)
    depts = await repo.list_departments(is_active=is_active)
    data = [
        DepartmentResponse(
            id=d.id,
            name=d.name,
            code=d.code,
            department_type=d.department_type,
            description=d.description,
            contact_email=d.contact_email,
            contact_phone=d.contact_phone,
            jurisdiction_level=d.jurisdiction_level,
            is_active=d.is_active,
            created_at=d.created_at.isoformat(),
            updated_at=d.updated_at.isoformat(),
        )
        for d in depts
    ]
    return APIResponse(message=f"Retrieved {len(data)} departments", data=data)


@router.post("/departments", response_model=APIResponse[DepartmentResponse], status_code=status.HTTP_201_CREATED, summary="Create a new government department")
async def create_department(req: DepartmentCreate, db: AsyncSession = Depends(get_db)):
    repo = DepartmentRepository(db)
    dept = DepartmentModel(
        name=req.name,
        code=req.code,
        department_type=req.department_type,
        description=req.description,
        contact_email=req.contact_email,
        contact_phone=req.contact_phone,
        jurisdiction_level=req.jurisdiction_level,
        is_active=req.is_active,
    )
    saved = await repo.create_department(dept)
    await db.commit()
    await db.refresh(saved)
    res = DepartmentResponse(
        id=saved.id,
        name=saved.name,
        code=saved.code,
        department_type=saved.department_type,
        description=saved.description,
        contact_email=saved.contact_email,
        contact_phone=saved.contact_phone,
        jurisdiction_level=saved.jurisdiction_level,
        is_active=saved.is_active,
        created_at=saved.created_at.isoformat(),
        updated_at=saved.updated_at.isoformat(),
    )
    return APIResponse(message="Department created successfully", data=res)


@router.get("/departments/{dept_id}", response_model=APIResponse[DepartmentResponse], summary="Get department details by ID")
async def get_department(dept_id: str, db: AsyncSession = Depends(get_db)):
    repo = DepartmentRepository(db)
    dept = await repo.get_department_by_id(dept_id)
    if not dept:
        raise EntityNotFoundError("Department", dept_id)
    res = DepartmentResponse(
        id=dept.id,
        name=dept.name,
        code=dept.code,
        department_type=dept.department_type,
        description=dept.description,
        contact_email=dept.contact_email,
        contact_phone=dept.contact_phone,
        jurisdiction_level=dept.jurisdiction_level,
        is_active=dept.is_active,
        created_at=dept.created_at.isoformat(),
        updated_at=dept.updated_at.isoformat(),
    )
    return APIResponse(message="Department retrieved successfully", data=res)


# ---------------- Districts ----------------
@router.get("/districts", response_model=APIResponse[List[DistrictResponse]], summary="List all administrative districts")
async def list_districts(
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    db: AsyncSession = Depends(get_db),
):
    repo = DepartmentRepository(db)
    districts = await repo.list_districts(is_active=is_active)
    data = [
        DistrictResponse(
            id=d.id,
            state=d.state,
            district_name=d.district_name,
            district_code=d.district_code,
            headquarters=d.headquarters,
            taluks=d.taluks or [],
            pincodes=d.pincodes or [],
            is_active=d.is_active,
            created_at=d.created_at.isoformat(),
            updated_at=d.updated_at.isoformat(),
        )
        for d in districts
    ]
    return APIResponse(message=f"Retrieved {len(data)} districts", data=data)


@router.post("/districts", response_model=APIResponse[DistrictResponse], status_code=status.HTTP_201_CREATED, summary="Create a new administrative district")
async def create_district(req: DistrictCreate, db: AsyncSession = Depends(get_db)):
    repo = DepartmentRepository(db)
    district = DistrictModel(
        state=req.state,
        district_name=req.district_name,
        district_code=req.district_code,
        headquarters=req.headquarters,
        taluks=req.taluks,
        pincodes=req.pincodes,
        is_active=req.is_active,
    )
    saved = await repo.create_district(district)
    await db.commit()
    await db.refresh(saved)
    res = DistrictResponse(
        id=saved.id,
        state=saved.state,
        district_name=saved.district_name,
        district_code=saved.district_code,
        headquarters=saved.headquarters,
        taluks=saved.taluks,
        pincodes=saved.pincodes,
        is_active=saved.is_active,
        created_at=saved.created_at.isoformat(),
        updated_at=saved.updated_at.isoformat(),
    )
    return APIResponse(message="District created successfully", data=res)


# ---------------- Offices ----------------
@router.get("/offices", response_model=APIResponse[List[OfficeResponse]], summary="List departmental field offices")
async def list_offices(
    department_id: Optional[str] = Query(None),
    district_id: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    repo = DepartmentRepository(db)
    offices = await repo.list_offices(department_id=department_id, district_id=district_id, is_active=is_active)
    data = [
        OfficeResponse(
            id=o.id,
            department_id=o.department_id,
            district_id=o.district_id,
            office_name=o.office_name,
            office_code=o.office_code,
            address=o.address,
            officer_in_charge_name=o.officer_in_charge_name,
            officer_in_charge_email=o.officer_in_charge_email,
            officer_in_charge_phone=o.officer_in_charge_phone,
            current_workload=o.current_workload,
            capacity=o.capacity,
            is_active=o.is_active,
            created_at=o.created_at.isoformat(),
            updated_at=o.updated_at.isoformat(),
        )
        for o in offices
    ]
    return APIResponse(message=f"Retrieved {len(data)} offices", data=data)


@router.post("/offices", response_model=APIResponse[OfficeResponse], status_code=status.HTTP_201_CREATED, summary="Create a departmental field office")
async def create_office(req: OfficeCreate, db: AsyncSession = Depends(get_db)):
    repo = DepartmentRepository(db)
    office = OfficeModel(
        department_id=req.department_id,
        district_id=req.district_id,
        office_name=req.office_name,
        office_code=req.office_code,
        address=req.address,
        officer_in_charge_name=req.officer_in_charge_name,
        officer_in_charge_email=req.officer_in_charge_email,
        officer_in_charge_phone=req.officer_in_charge_phone,
        capacity=req.capacity,
        is_active=req.is_active,
    )
    saved = await repo.create_office(office)
    await db.commit()
    await db.refresh(saved)
    res = OfficeResponse(
        id=saved.id,
        department_id=saved.department_id,
        district_id=saved.district_id,
        office_name=saved.office_name,
        office_code=saved.office_code,
        address=saved.address,
        officer_in_charge_name=saved.officer_in_charge_name,
        officer_in_charge_email=saved.officer_in_charge_email,
        officer_in_charge_phone=saved.officer_in_charge_phone,
        current_workload=saved.current_workload,
        capacity=saved.capacity,
        is_active=saved.is_active,
        created_at=saved.created_at.isoformat(),
        updated_at=saved.updated_at.isoformat(),
    )
    return APIResponse(message="Office created successfully", data=res)
