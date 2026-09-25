import pytest
from httpx import AsyncClient
from shared.enums import IssueCategory, PriorityLevel


@pytest.mark.asyncio
async def test_evaluate_routing_exact_match(client: AsyncClient, seed_data):
    # Route an issue matching Roads & Transport in Bengaluru Urban
    payload = {
        "issue_id": "ISSUE-ROAD-101",
        "category": IssueCategory.ROADS_AND_TRANSPORT.value,
        "subcategory": "Potholes and Road Surface Damage",
        "severity_score": 0.75,
        "priority": PriorityLevel.HIGH.value,
        "pincode": "560034",
        "district_name": "Bengaluru Urban",
        "keywords": ["pothole", "asphalt"],
    }
    res = await client.post("/api/v1/routing/evaluate", json=payload)
    assert res.status_code == 200
    res_json = res.json()
    assert res_json["success"] is True
    data = res_json["data"]
    assert data["issue_id"] == "ISSUE-ROAD-101"
    assert data["assigned_department_name"] == "Public Works Department"
    assert data["assigned_office_name"] == "PWD North Division Office"
    assert data["matched_rule_id"] is not None
    assert "Matched active routing rule" in data["routing_rationale"]


@pytest.mark.asyncio
async def test_evaluate_routing_fallback(client: AsyncClient, seed_data):
    # Route an issue with no specific rule matching (e.g. Water & Sanitation in an unconfigured district)
    payload = {
        "issue_id": "ISSUE-WATER-202",
        "category": IssueCategory.WATER_AND_SANITATION.value,
        "severity_score": 0.4,
        "priority": PriorityLevel.MEDIUM.value,
        "pincode": "999999",  # Unregistered pincode
    }
    res = await client.post("/api/v1/routing/evaluate", json=payload)
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["issue_id"] == "ISSUE-WATER-202"
    assert data["matched_rule_id"] is None
    assert "No specialized rule matched" in data["routing_rationale"]


@pytest.mark.asyncio
async def test_routing_rules_crud(client: AsyncClient, seed_data):
    # List rules
    list_res = await client.get("/api/v1/routing/rules")
    assert list_res.status_code == 200
    rules = list_res.json()["data"]
    assert len(rules) >= 1

    # Create new rule
    new_rule = {
        "name": "Emergency Water Pipeline Rupture Rule",
        "priority_order": 1,
        "category": IssueCategory.WATER_AND_SANITATION.value,
        "subcategory": "Pipeline Burst",
        "district_id": seed_data["district"].id,
        "min_severity": 0.8,
        "max_severity": 1.0,
        "target_department_id": seed_data["department"].id,
        "is_active": True,
        "conditions": {"keywords": ["burst", "flooding"]},
    }
    create_res = await client.post("/api/v1/routing/rules", json=new_rule)
    assert create_res.status_code == 201
    created_rule = create_res.json()["data"]
    assert created_rule["priority_order"] == 1

    # Delete rule
    del_res = await client.delete(f"/api/v1/routing/rules/{created_rule['id']}")
    assert del_res.status_code == 200
    assert del_res.json()["data"] is True
