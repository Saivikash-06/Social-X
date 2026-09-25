import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_admin_dashboard(async_client: AsyncClient):
    response = await async_client.get("/dashboard/admin")
    assert response.status_code == 200
    res_json = response.json()

    assert res_json["success"] is True
    assert "data" in res_json
    data = res_json["data"]

    # Verify KPI counts
    kpis = data["kpis"]
    assert kpis["total_issues"] > 0
    assert kpis["resolved_issues"] > 0
    assert kpis["resolution_rate"] > 0.0

    # Verify Leaderboard
    leaderboard = data["department_leaderboard"]
    assert isinstance(leaderboard, list)
    assert len(leaderboard) > 0
    assert "department_name" in leaderboard[0]
    assert "resolution_rate" in leaderboard[0]

    # Verify Category distribution
    categories = data["category_distribution"]
    assert isinstance(categories, list)
    assert len(categories) > 0

    # Verify Critical alerts
    alerts = data["critical_alerts"]
    assert isinstance(alerts, list)


@pytest.mark.asyncio
async def test_gov_dashboard(async_client: AsyncClient):
    response = await async_client.get("/dashboard/gov")
    assert response.status_code == 200
    res_json = response.json()

    assert res_json["success"] is True
    data = res_json["data"]
    assert data["assigned_total"] > 0
    assert "priority_action_items" in data
    assert "district_distribution" in data
    assert "active_collaborations" in data

    # Test with department filter
    filtered_res = await async_client.get("/dashboard/gov?department_id=1")
    assert filtered_res.status_code == 200
    assert filtered_res.json()["data"]["department_id"] == 1


@pytest.mark.asyncio
async def test_university_dashboard(async_client: AsyncClient):
    response = await async_client.get("/dashboard/university")
    assert response.status_code == 200
    res_json = response.json()

    assert res_json["success"] is True
    data = res_json["data"]
    assert data["active_research_projects"] > 0
    assert data["total_students_engaged"] > 0
    assert isinstance(data["open_challenges"], list)
    assert isinstance(data["my_active_projects"], list)


@pytest.mark.asyncio
async def test_industry_dashboard(async_client: AsyncClient):
    response = await async_client.get("/dashboard/industry")
    assert response.status_code == 200
    res_json = response.json()

    assert res_json["success"] is True
    data = res_json["data"]
    assert data["csr_budget_allocated"] > 0
    assert data["estimated_citizens_impacted"] > 0
    assert isinstance(data["sponsored_projects"], list)
    assert isinstance(data["open_funding_opportunities"], list)


@pytest.mark.asyncio
async def test_citizen_dashboard(async_client: AsyncClient):
    response = await async_client.get("/dashboard/citizen?citizen_id=CITIZEN-101")
    assert response.status_code == 200
    res_json = response.json()

    assert res_json["success"] is True
    data = res_json["data"]
    assert data["citizen_id"] == "CITIZEN-101"
    assert data["community_total_issues"] > 0
    assert isinstance(data["my_reported_issues"], list)
    assert isinstance(data["recent_community_resolutions"], list)
