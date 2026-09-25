import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_generate_json_report(async_client: AsyncClient):
    response = await async_client.get("/reports?report_type=SUMMARY&format=JSON")
    assert response.status_code == 200
    res_json = response.json()

    assert res_json["success"] is True
    assert "data" in res_json
    data = res_json["data"]

    assert "report_id" in data
    assert data["report_type"] == "SUMMARY"
    assert data["format"] == "JSON"
    assert data["total_records"] > 0
    assert "summary_stats" in data
    assert "items" in data
    assert len(data["items"]) == data["total_records"]
    assert "ticket_id" in data["items"][0]


@pytest.mark.asyncio
async def test_generate_csv_report(async_client: AsyncClient):
    response = await async_client.get("/reports?report_type=DEPARTMENT_PERFORMANCE&format=CSV")
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/csv")
    assert "attachment" in response.headers.get("content-disposition", "")

    csv_text = response.text
    lines = csv_text.strip().split("\r\n") if "\r\n" in csv_text else csv_text.strip().split("\n")
    # Header check
    assert "Ticket ID" in lines[0]
    assert "Category" in lines[0]
    assert "Status" in lines[0]
    # Data rows present
    assert len(lines) > 1


@pytest.mark.asyncio
async def test_generate_report_with_filters(async_client: AsyncClient):
    response = await async_client.get("/reports?report_type=SUMMARY&format=JSON&department_id=1")
    assert response.status_code == 200
    res_json = response.json()
    data = res_json["data"]
    assert data["total_records"] > 0
    for item in data["items"]:
        # All items should belong to department 1 if assigned
        assert item["department_name"] is not None
