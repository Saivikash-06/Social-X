import pytest
from httpx import AsyncClient
from shared.enums import DepartmentType


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["success"] is True
    assert res_json["data"]["status"] == "HEALTHY"


@pytest.mark.asyncio
async def test_create_and_list_departments(client: AsyncClient, seed_data):
    # List initial departments
    res = await client.get("/api/v1/departments")
    assert res.status_code == 200
    data = res.json()["data"]
    assert len(data) >= 1
    assert data[0]["code"] == "PWD"

    # Create new department
    new_dept = {
        "name": "Bangalore Water Supply and Sewerage Board",
        "code": "BWSSB",
        "department_type": DepartmentType.WATER_SUPPLY_SEWERAGE.value,
        "description": "Water and sewerage management",
        "contact_email": "water@bwssb.gov.in",
        "contact_phone": "+91-80-22222222",
        "jurisdiction_level": "District",
        "is_active": True,
    }
    create_res = await client.post("/api/v1/departments", json=new_dept)
    assert create_res.status_code == 201
    created = create_res.json()["data"]
    assert created["code"] == "BWSSB"
    assert created["id"] is not None

    # Fetch by ID
    get_res = await client.get(f"/api/v1/departments/{created['id']}")
    assert get_res.status_code == 200
    assert get_res.json()["data"]["name"] == "Bangalore Water Supply and Sewerage Board"


@pytest.mark.asyncio
async def test_districts_and_pincode_resolution(client: AsyncClient, seed_data):
    res = await client.get("/api/v1/districts")
    assert res.status_code == 200
    districts = res.json()["data"]
    assert len(districts) >= 1
    assert "560001" in districts[0]["pincodes"]

    # Create another district
    new_dist = {
        "state": "Karnataka",
        "district_name": "Mysuru",
        "district_code": "MYS",
        "headquarters": "Mysuru",
        "taluks": ["Mysuru", "Nanjangud"],
        "pincodes": ["570001", "570002"],
        "is_active": True,
    }
    create_res = await client.post("/api/v1/districts", json=new_dist)
    assert create_res.status_code == 201
    assert create_res.json()["data"]["district_code"] == "MYS"


@pytest.mark.asyncio
async def test_offices_listing(client: AsyncClient, seed_data):
    dept_id = seed_data["department"].id
    res = await client.get(f"/api/v1/offices?department_id={dept_id}")
    assert res.status_code == 200
    offices = res.json()["data"]
    assert len(offices) == 1
    assert offices[0]["office_code"] == "PWD-BLR-01"
