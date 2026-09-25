import pytest
from httpx import AsyncClient
from shared.enums import WorkflowStatus, PriorityLevel, IssueCategory


@pytest.mark.asyncio
async def test_full_8_stage_workflow_lifecycle(client: AsyncClient, seed_data):
    issue_id = "ISSUE-CIVIC-888"
    dept_id = seed_data["department"].id

    # 1. Initialize in SUBMITTED state
    create_payload = {
        "issue_id": issue_id,
        "category": IssueCategory.ROADS_AND_TRANSPORT.value,
        "priority": PriorityLevel.HIGH.value,
        "assigned_department_id": dept_id,
        "initial_remarks": "Citizen reported large crater on Main Road.",
    }
    res1 = await client.post("/api/v1/workflow", json=create_payload)
    assert res1.status_code == 201
    w1 = res1.json()["data"]
    assert w1["current_state"] == WorkflowStatus.SUBMITTED.value
    assert w1["sla_hours"] == 24
    assert w1["sla_due_at"] is not None

    # 2. Transition: Submitted -> Verified
    t2_payload = {
        "to_state": WorkflowStatus.VERIFIED.value,
        "actor_id": "VERIFIER_007",
        "actor_role": "VerificationOfficer",
        "remarks": "AI media analysis and location coordinates cross-checked.",
    }
    res2 = await client.post(f"/api/v1/workflow/{issue_id}/transition", json=t2_payload)
    assert res2.status_code == 200
    assert res2.json()["data"]["current_state"] == WorkflowStatus.VERIFIED.value

    # 3. Transition: Verified -> Assigned (Via Government Allocation endpoint)
    assign_payload = {
        "issue_id": issue_id,
        "department_id": dept_id,
        "office_id": seed_data["office"].id,
        "owner_id": "OFFICER_PWD_99",
        "owner_name": "Assistant Executive Engineer Sharma",
        "owner_email": "sharma.pwd@gov.in",
        "assigned_by_id": "ADMIN_ROUTING",
        "remarks": "Assigned to North Division road maintenance squad.",
    }
    res3 = await client.post("/api/v1/assignment/owner", json=assign_payload)
    assert res3.status_code == 200
    w3 = res3.json()["data"]
    assert w3["current_state"] == WorkflowStatus.ASSIGNED.value
    assert w3["owner_id"] == "OFFICER_PWD_99"

    # 4. Transition: Assigned -> Accepted
    t4_payload = {
        "to_state": WorkflowStatus.ACCEPTED.value,
        "actor_id": "OFFICER_PWD_99",
        "actor_role": "DepartmentOfficer",
        "remarks": "Acknowledged assignment. Work crew scheduled for site visit.",
    }
    res4 = await client.post(f"/api/v1/workflow/{issue_id}/transition", json=t4_payload)
    assert res4.status_code == 200
    assert res4.json()["data"]["current_state"] == WorkflowStatus.ACCEPTED.value

    # 5. Transition: Accepted -> In Progress
    t5_payload = {
        "to_state": WorkflowStatus.IN_PROGRESS.value,
        "actor_id": "OFFICER_PWD_99",
        "actor_role": "DepartmentOfficer",
        "remarks": "Asphalt hot-mix leveling and compaction in progress on site.",
    }
    res5 = await client.post(f"/api/v1/workflow/{issue_id}/transition", json=t5_payload)
    assert res5.status_code == 200
    assert res5.json()["data"]["current_state"] == WorkflowStatus.IN_PROGRESS.value

    # 6. Transition: In Progress -> Completed
    # Note: Transitioning to Completed automatically triggers state to Citizen Verification
    t6_payload = {
        "to_state": WorkflowStatus.COMPLETED.value,
        "actor_id": "OFFICER_PWD_99",
        "actor_role": "DepartmentOfficer",
        "resolution_notes": "Crater patched, rolled, and resurfaced. Traffic resumed.",
        "resolution_evidence_url": "https://storage.gov.in/evidence/pothole_fixed_888.jpg",
    }
    res6 = await client.post(f"/api/v1/workflow/{issue_id}/transition", json=t6_payload)
    assert res6.status_code == 200
    w6 = res6.json()["data"]
    assert w6["current_state"] == WorkflowStatus.CITIZEN_VERIFICATION.value
    assert w6["resolution_notes"] == "Crater patched, rolled, and resurfaced. Traffic resumed."

    # 7. Transition: Citizen Verification -> Closed
    verify_payload = {
        "citizen_id": "CITIZEN_12345",
        "verified_satisfactory": True,
        "feedback": "Pothole completely repaired and smooth. Excellent work!",
        "rating": 5,
    }
    res7 = await client.post(f"/api/v1/workflow/{issue_id}/verify", json=verify_payload)
    assert res7.status_code == 200
    w7 = res7.json()["data"]
    assert w7["current_state"] == WorkflowStatus.CLOSED.value
    assert w7["citizen_verified"] is True
    assert w7["citizen_rating"] == 5

    # 8. Verify complete audit trail history
    history_res = await client.get(f"/api/v1/workflow/{issue_id}")
    assert history_res.status_code == 200
    history_items = history_res.json()["data"]["history"]
    assert len(history_items) >= 7
    triggers = [h["trigger"] for h in history_items]
    assert "ISSUE_REGISTERED" in triggers
    assert "CITIZEN_VERIFIED_CLOSED" in triggers


@pytest.mark.asyncio
async def test_invalid_transition_rejection(client: AsyncClient, seed_data):
    issue_id = "ISSUE-INVALID-001"
    # Create submitted issue
    await client.post("/api/v1/workflow", json={
        "issue_id": issue_id,
        "priority": PriorityLevel.MEDIUM.value,
    })

    # Attempt illegal jump directly from Submitted to Completed
    illegal_jump = {
        "to_state": WorkflowStatus.COMPLETED.value,
        "actor_id": "HACKER",
        "actor_role": "Citizen",
        "resolution_notes": "Fake fix",
    }
    res = await client.post(f"/api/v1/workflow/{issue_id}/transition", json=illegal_jump)
    assert res.status_code == 400
    res_json = res.json()
    assert res_json["success"] is False
    assert res_json["error_code"] == "INVALID_STATE_TRANSITION"


@pytest.mark.asyncio
async def test_citizen_unsatisfied_reopens_issue(client: AsyncClient, seed_data):
    issue_id = "ISSUE-REOPEN-777"
    dept_id = seed_data["department"].id

    # Create and advance to Citizen Verification
    await client.post("/api/v1/workflow", json={
        "issue_id": issue_id,
        "assigned_department_id": dept_id,
    })
    await client.post(f"/api/v1/workflow/{issue_id}/transition", json={
        "to_state": WorkflowStatus.VERIFIED.value,
        "actor_id": "VERIFIER",
        "actor_role": "Verifier",
    })
    await client.post("/api/v1/assignment/owner", json={
        "issue_id": issue_id,
        "department_id": dept_id,
        "owner_id": "OFFICER_1",
        "owner_name": "Official 1",
        "owner_email": "off1@gov.in",
        "assigned_by_id": "ADMIN",
    })
    await client.post(f"/api/v1/workflow/{issue_id}/transition", json={
        "to_state": WorkflowStatus.ACCEPTED.value,
        "actor_id": "OFFICER_1",
        "actor_role": "Officer",
    })
    await client.post(f"/api/v1/workflow/{issue_id}/transition", json={
        "to_state": WorkflowStatus.IN_PROGRESS.value,
        "actor_id": "OFFICER_1",
        "actor_role": "Officer",
    })
    await client.post(f"/api/v1/workflow/{issue_id}/transition", json={
        "to_state": WorkflowStatus.COMPLETED.value,
        "actor_id": "OFFICER_1",
        "actor_role": "Officer",
        "resolution_notes": "Claimed fixed",
    })

    # Citizen is NOT satisfied
    unsatisfied_payload = {
        "citizen_id": "CITIZEN_ANGRY",
        "verified_satisfactory": False,
        "feedback": "Debris left behind and water still overflowing.",
        "rating": 1,
    }
    reopen_res = await client.post(f"/api/v1/workflow/{issue_id}/verify", json=unsatisfied_payload)
    assert reopen_res.status_code == 200
    assert reopen_res.json()["data"]["current_state"] == WorkflowStatus.REOPENED.value
