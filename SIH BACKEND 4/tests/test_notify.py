import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_send_email_notification(async_client: AsyncClient):
    payload = {
        "recipient_email": "citizen.lead@example.com",
        "recipient_name": "Citizen Volunteer Lead",
        "subject": "Action Required: Community Pothole Repair Verification",
        "body_text": "Your reported issue TKT-2026-00101 has been marked resolved. Please verify on site.",
        "template_name": "issue_resolved_alert"
    }
    response = await async_client.post("/notify/email", json=payload)
    assert response.status_code == 200
    res_json = response.json()

    assert res_json["success"] is True
    assert "data" in res_json
    data = res_json["data"]
    assert data["channel"] == "EMAIL"
    assert data["status"] == "SENT"
    assert data["recipient"] == "citizen.lead@example.com"
    assert "message_id" in data
    assert data["message_id"].startswith("msg_")


@pytest.mark.asyncio
async def test_send_email_validation_error(async_client: AsyncClient):
    # Invalid email address should return 422 standard validation error
    payload = {
        "recipient_email": "not-a-valid-email",
        "subject": "Hi",
        "body_text": "Test"
    }
    response = await async_client.post("/notify/email", json=payload)
    assert response.status_code == 422
    res_json = response.json()
    assert res_json["success"] is False
    assert res_json["error"]["code"] == "VALIDATION_ERROR"


@pytest.mark.asyncio
async def test_send_system_notification(async_client: AsyncClient):
    payload = {
        "recipient_id": "OFFICER-PWD-09",
        "recipient_role": "GOV",
        "title": "Emergency Escalation: Ward 4 Water Contamination",
        "message": "Immediate water tanker deployment ordered for sector 4.",
        "priority": "URGENT",
        "action_url": "/dashboard/gov?department_id=2",
        "data_payload": {"ticket_id": "TKT-2026-00105", "severity": "CRITICAL"}
    }
    response = await async_client.post("/notify/system", json=payload)
    assert response.status_code == 201
    res_json = response.json()

    assert res_json["success"] is True
    data = res_json["data"]
    assert data["channel"] == "SYSTEM"
    assert data["status"] == "SENT"
    assert data["recipient"] == "OFFICER-PWD-09"
    assert data["notification_id"] > 0
