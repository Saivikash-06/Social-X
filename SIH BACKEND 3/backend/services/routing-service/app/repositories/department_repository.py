from typing import List, Optional
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import DepartmentModel, DistrictModel, OfficeModel


class DepartmentRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    # Department operations
    async def get_department_by_id(self, dept_id: str) -> Optional[DepartmentModel]:
        res = await self.session.execute(select(DepartmentModel).where(DepartmentModel.id == dept_id))
        return res.scalar_one_or_none()

    async def get_department_by_code(self, code: str) -> Optional[DepartmentModel]:
        res = await self.session.execute(select(DepartmentModel).where(DepartmentModel.code == code))
        return res.scalar_one_or_none()

    async def list_departments(self, is_active: Optional[bool] = None) -> List[DepartmentModel]:
        query = select(DepartmentModel)
        if is_active is not None:
            query = query.where(DepartmentModel.is_active == is_active)
        res = await self.session.execute(query.order_by(DepartmentModel.name))
        return list(res.scalars().all())

    async def create_department(self, dept: DepartmentModel) -> DepartmentModel:
        self.session.add(dept)
        await self.session.flush()
        return dept

    async def update_department(self, dept_id: str, updates: dict) -> Optional[DepartmentModel]:
        await self.session.execute(
            update(DepartmentModel).where(DepartmentModel.id == dept_id).values(**updates)
        )
        await self.session.flush()
        return await self.get_department_by_id(dept_id)

    # District operations
    async def get_district_by_id(self, district_id: str) -> Optional[DistrictModel]:
        res = await self.session.execute(select(DistrictModel).where(DistrictModel.id == district_id))
        return res.scalar_one_or_none()

    async def get_district_by_name_or_code(self, name_or_code: str) -> Optional[DistrictModel]:
        res = await self.session.execute(
            select(DistrictModel).where(
                (DistrictModel.district_name.ilike(name_or_code)) |
                (DistrictModel.district_code.ilike(name_or_code))
            )
        )
        return res.scalar_one_or_none()

    async def find_district_by_pincode(self, pincode: str) -> Optional[DistrictModel]:
        # Pincodes is a JSON array
        districts = await self.list_districts(is_active=True)
        for dist in districts:
            if pincode in (dist.pincodes or []):
                return dist
        return None

    async def list_districts(self, is_active: Optional[bool] = None) -> List[DistrictModel]:
        query = select(DistrictModel)
        if is_active is not None:
            query = query.where(DistrictModel.is_active == is_active)
        res = await self.session.execute(query.order_by(DistrictModel.district_name))
        return list(res.scalars().all())

    async def create_district(self, district: DistrictModel) -> DistrictModel:
        self.session.add(district)
        await self.session.flush()
        return district

    async def update_district(self, district_id: str, updates: dict) -> Optional[DistrictModel]:
        await self.session.execute(
            update(DistrictModel).where(DistrictModel.id == district_id).values(**updates)
        )
        await self.session.flush()
        return await self.get_district_by_id(district_id)

    # Office operations
    async def get_office_by_id(self, office_id: str) -> Optional[OfficeModel]:
        res = await self.session.execute(select(OfficeModel).where(OfficeModel.id == office_id))
        return res.scalar_one_or_none()

    async def list_offices(
        self,
        department_id: Optional[str] = None,
        district_id: Optional[str] = None,
        is_active: Optional[bool] = None,
    ) -> List[OfficeModel]:
        query = select(OfficeModel)
        if department_id:
            query = query.where(OfficeModel.department_id == department_id)
        if district_id:
            query = query.where(OfficeModel.district_id == district_id)
        if is_active is not None:
            query = query.where(OfficeModel.is_active == is_active)
        res = await self.session.execute(query.order_by(OfficeModel.office_name))
        return list(res.scalars().all())

    async def create_office(self, office: OfficeModel) -> OfficeModel:
        self.session.add(office)
        await self.session.flush()
        return office

    async def increment_workload(self, office_id: str, delta: int = 1):
        office = await self.get_office_by_id(office_id)
        if office:
            office.current_workload = max(0, office.current_workload + delta)
            await self.session.flush()
