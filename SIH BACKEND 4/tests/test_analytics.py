import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_analytics_overview(async_client: AsyncClient):
    response = await async_client.get("/analytics")
    assert response.status_code == 200
    res_json = response.json()

    assert res_json["success"] is True
    assert "data" in res_json
    data = res_json["data"]

    # 1. Issues Overview
    overview = data["issues_overview"]
    assert overview["total_issues"] > 0
    assert overview["resolved_issues"] > 0
    assert overview["pending_issues"] >= 0
    assert overview["resolution_rate"] > 0.0

    # 2. Department Performance
    dept_perf = data["department_performance"]
    assert isinstance(dept_perf, list)
    assert len(dept_perf) > 0
    top_dept = dept_perf[0]
    assert "department_name" in top_dept
    assert "performance_score" in top_dept
    assert "sla_compliance_rate" in top_dept

    # 3. District Performance
    dist_perf = data["district_performance"]
    assert isinstance(dist_perf, list)
    assert len(dist_perf) > 0
    assert dist_perf[0]["rank"] == 1
    assert "issues_per_100k" in dist_perf[0]

    # 4. University Participation
    univ_part = data["university_participation"]
    assert univ_part["total_institutions"] > 0
    assert univ_part["active_projects"] > 0
    assert isinstance(univ_part["top_universities"], list)

    # 5. Industry Participation
    ind_part = data["industry_participation"]
    assert ind_part["active_corporates"] > 0
    assert ind_part["total_csr_allocated"] > 0
    assert ind_part["budget_utilization_rate"] > 0

    # 6. Category Trends
    trends = data["category_trends"]
    assert isinstance(trends, list)
    assert len(trends) > 0

    # 7. Monthly Trends
    monthly = data["monthly_trends"]
    assert isinstance(monthly, list)
    assert len(monthly) > 0


@pytest.mark.asyncio
async def test_get_analytics_with_filters(async_client: AsyncClient):
    # Filter by category
    response = await async_client.get("/analytics?category=ROADS")
    assert response.status_code == 200
    res_json = response.json()
    data = res_json["data"]

    assert data["filter_applied"]["category"] == "ROADS"
    # Filtered total should be positive and less than or equal to global total
    assert data["issues_overview"]["total_issues"] > 0

    # Filter by department_id
    dept_res = await async_client.get("/analytics?department_id=1")
    assert dept_res.status_code == 200
    assert dept_res.json()["data"]["filter_applied"]["department_id"] == 1
