import asyncio
import sys
from pathlib import Path
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

# Setup Python sys.path
test_file = Path(__file__).resolve()
app_dir = test_file.parent.parent
routing_service_dir = app_dir.parent
backend_dir = routing_service_dir.parent

if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))
if str(routing_service_dir) not in sys.path:
    sys.path.insert(0, str(routing_service_dir))

from app.core.database import Base, get_db
from app.models.models import DepartmentModel, DistrictModel, OfficeModel, RoutingRuleModel
from shared.enums import DepartmentType, IssueCategory
from main import app

# Isolated In-Memory SQLite Engine for Testing
TEST_DB_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(
    TEST_DB_URL,
    connect_args={"check_same_thread": False},
)

TestingSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


@pytest_asyncio.fixture(scope="function")
async def db_session():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestingSessionLocal() as session:
        yield session
        await session.rollback()

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession):
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as c:
        yield c
    app.dependency_overrides.clear()


@pytest_asyncio.fixture(scope="function")
async def seed_data(db_session: AsyncSession):
    # Seed Department
    pwd_dept = DepartmentModel(
        name="Public Works Department",
        code="PWD",
        department_type=DepartmentType.PUBLIC_WORKS,
        description="Responsible for public roads, bridges, and infrastructure.",
        contact_email="contact@pwd.gov.in",
        contact_phone="+91-11-23456789",
        jurisdiction_level="State",
        is_active=True,
    )
    db_session.add(pwd_dept)

    # Seed District
    blr_district = DistrictModel(
        state="Karnataka",
        district_name="Bengaluru Urban",
        district_code="BLR_URBAN",
        headquarters="Bengaluru",
        taluks=["Bangalore North", "Bangalore South", "Bangalore East"],
        pincodes=["560001", "560002", "560034", "560095"],
        is_active=True,
    )
    db_session.add(blr_district)
    await db_session.flush()

    # Seed Office
    pwd_office = OfficeModel(
        department_id=pwd_dept.id,
        district_id=blr_district.id,
        office_name="PWD North Division Office",
        office_code="PWD-BLR-01",
        address="K.R. Circle, Bengaluru",
        officer_in_charge_name="Er. Ramesh Kumar",
        officer_in_charge_email="ramesh.pwd@gov.in",
        officer_in_charge_phone="+91-9876543210",
        capacity=50,
        current_workload=5,
        is_active=True,
    )
    db_session.add(pwd_office)
    await db_session.flush()

    # Seed Routing Rule
    road_rule = RoutingRuleModel(
        name="Roads & Highways Primary Allocation",
        priority_order=10,
        category=IssueCategory.ROADS_AND_TRANSPORT,
        district_id=blr_district.id,
        min_severity=0.0,
        max_severity=1.0,
        target_department_id=pwd_dept.id,
        target_office_id=pwd_office.id,
        is_active=True,
        conditions={},
    )
    db_session.add(road_rule)
    await db_session.commit()

    return {
        "department": pwd_dept,
        "district": blr_district,
        "office": pwd_office,
        "rule": road_rule,
    }
