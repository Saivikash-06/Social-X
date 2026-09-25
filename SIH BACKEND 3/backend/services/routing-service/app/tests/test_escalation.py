import pytest
from httpx import AsyncClient
from shared.enums import PriorityLevel, EscalationLevel


@pytest.mark.asyncio
async def test_escalation_flow(client: AsyncClient, seed_data):
    issue_id = "ISSUE-ESCALATE-999"

    # 1. Create workflow with Critical priority
    await client.post("/api/v1/workflow", json={
        "issue_id": issue_id,
        "priority": PriorityLevel.CRITICAL.value,
        "assigned_department_id": seed_data["department"].id,
    })

    # 2. Check SLA status
    sla_res = await client.get(f"/api/v1/escalations/{issue_id}/sla")
    assert sla_res.status_code == 200
    sla_data = sla_res.json()["data"]
    assert sla_data["sla_hours"] == 12
    assert sla_data["is_breached"] is False
    assert sla_data["hours_remaining"] > 0

    # 3. Trigger manual escalation to Level 2 (District Nodal Officer)
    esc_payload = {
        "issue_id": issue_id,
        "target_level": EscalationLevel.LEVEL_2.value,
        "reason": "Emergency flood gate jammed; local team lacks heavy crane equipment.",
        "triggered_by": "OFFICER_FIELD_12",
        "new_owner_id": "NODAL_OFFICER_DISTRICT",
    }
    esc_res = await client.post("/api/v1/escalations/trigger", json=esc_payload)
    assert esc_res.status_code == 200
    log_data = esc_res.json()["data"]
    assert log_data["escalation_level"] == EscalationLevel.LEVEL_2.value
    assert log_data["new_owner_id"] == "NODAL_OFFICER_DISTRICT"

    # 4. Check workflow instance shows escalated
    wf_res = await client.get(f"/api/v1/workflow/{issue_id}")
    wf_data = wf_res.json()["data"]
    assert wf_data["is_escalated"] is True
    assert wf_data["escalation_level"] == EscalationLevel.LEVEL_2.value
    assert wf_data["owner_id"] == "NODAL_OFFICER_DISTRICT"

    # 5. List escalation logs
    logs_res = await client.get(f"/api/v1/escalations/{issue_id}/logs")
    assert logs_res.status_code == 200
    logs = logs_res.json()["data"]
    assert len(logs) == 1
    assert "heavy crane equipment" in logs[0]["reason"]


@pytest.mark.asyncio
async def test_escalation_policies_crud(client: AsyncClient, seed_data):
    policy_payload = {
        "name": "Standard Critical Issue Escalation Policy",
        "priority": PriorityLevel.CRITICAL.value,
        "level": EscalationLevel.LEVEL_3.value,
        "breach_hours_threshold": 12,
        "escalate_to_role": "State Nodal Director",
        "notify_emails": ["director.infra@gov.in", "alerts@smartgov.org"],
        "is_active": True,
    }
    create_res = await client.post("/api/v1/escalations/policies", json=policy_payload)
    assert create_res.status_code == 201
    policy = create_res.json()["data"]
    assert policy["name"] == "Standard Critical Issue Escalation Policy"
    assert policy["breach_hours_threshold"] == 12

    # List policies
    list_res = await client.get("/api/v1/escalations/policies")
    assert list_res.status_code == 200
    assert len(list_res.json()["data"]) >= 1
