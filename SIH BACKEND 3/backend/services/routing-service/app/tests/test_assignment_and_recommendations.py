import pytest
from httpx import AsyncClient
from shared.enums import (
    IssueCategory,
    PriorityLevel,
    StakeholderType,
    AssignmentRole,
    CollaborationStatus,
)


@pytest.mark.asyncio
async def test_reassignment_with_audit_reason(client: AsyncClient, seed_data):
    issue_id = "ISSUE-REASSIGN-101"
    dept_id = seed_data["department"].id

    # Create workflow
    await client.post("/api/v1/workflow", json={"issue_id": issue_id, "assigned_department_id": dept_id})
    # Initial assign
    await client.post("/api/v1/assignment/owner", json={
        "issue_id": issue_id,
        "department_id": dept_id,
        "owner_id": "OFFICER_A",
        "owner_name": "Engineer A",
        "owner_email": "a@gov.in",
        "assigned_by_id": "SUPERVISOR",
    })

    # Reassign
    reassign_payload = {
        "new_owner_id": "OFFICER_B",
        "new_owner_name": "Executive Engineer B",
        "new_owner_email": "b@gov.in",
        "reassigned_by_id": "SUPERVISOR",
        "reason": "Officer A is on medical leave; workload transferred to Section B.",
    }
    res = await client.post(f"/api/v1/assignment/{issue_id}/reassign", json=reassign_payload)
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["owner_id"] == "OFFICER_B"
    assert data["owner_name"] == "Executive Engineer B"

    # Check history logs reason
    wf_res = await client.get(f"/api/v1/workflow/{issue_id}")
    history = wf_res.json()["data"]["history"]
    reassign_entry = [h for h in history if h["trigger"] == "GOVERNMENT_OWNER_REASSIGNED"]
    assert len(reassign_entry) == 1
    assert "medical leave" in reassign_entry[0]["remarks"]


@pytest.mark.asyncio
async def test_multi_stakeholder_recommendations(client: AsyncClient, seed_data):
    issue_id = "ISSUE-INNOVATION-500"
    payload = {
        "issue_id": issue_id,
        "category": IssueCategory.WATER_AND_SANITATION.value,
        "priority": PriorityLevel.HIGH.value,
        "district_name": "Bengaluru Urban",
        "title": "Severe ground water contamination and broken pipeline",
        "description": "High fluorides and industrial runoff contaminating municipal borewells.",
        "tags": ["water", "contamination", "chemistry"],
    }
    gen_res = await client.post("/api/v1/recommendations/generate", json=payload)
    assert gen_res.status_code == 200
    data = gen_res.json()["data"]

    # Universities
    univs = data["university_recommendations"]
    assert len(univs) >= 1
    assert any("Water" in u["matching_domain"] for u in univs)
    assert univs[0]["match_score"] >= 0.85
    assert univs[0]["recommended_role"] == AssignmentRole.ACADEMIC_RESEARCH.value

    # Industries (CSR)
    inds = data["industry_recommendations"]
    assert len(inds) >= 1
    assert any("CSR" in i["matching_domain"] or "Drinking Water" in i["matching_domain"] for i in inds)

    # Volunteers (NSS / NGOs)
    vols = data["volunteer_recommendations"]
    assert len(vols) >= 1
    assert any("NSS" in v["entity_name"] or "CleanCity" in v["entity_name"] for v in vols)


@pytest.mark.asyncio
async def test_collaboration_lifecycle(client: AsyncClient, seed_data):
    issue_id = "ISSUE-COLLAB-303"

    # 1. Invite a University Research Lab
    invite_payload = {
        "issue_id": issue_id,
        "stakeholder_type": StakeholderType.UNIVERSITY.value,
        "stakeholder_id": "UNIV_LAB_01",
        "stakeholder_name": "Center for Urban Hydrology, IISc",
        "role": AssignmentRole.ACADEMIC_RESEARCH.value,
        "notes": "Inviting research team for sensor telemetry and pipe corrosion study.",
    }
    inv_res = await client.post("/api/v1/collaborations/invite", json=invite_payload)
    assert inv_res.status_code == 201
    collab = inv_res.json()["data"]
    collab_id = collab["id"]
    assert collab["status"] == CollaborationStatus.INVITED.value

    # 2. Accept Invitation
    action_payload = {
        "action": CollaborationStatus.ACCEPTED.value,
        "notes": "Department head accepted. Faculty advisor Dr. Rao assigned.",
    }
    accept_res = await client.post(f"/api/v1/collaborations/{collab_id}/respond", json=action_payload)
    assert accept_res.status_code == 200
    assert accept_res.json()["data"]["status"] == CollaborationStatus.ACCEPTED.value

    # 3. Log Contribution
    contrib_payload = {
        "contribution_type": "Research Milestone",
        "summary": "Completed initial water quality report; TDS and microbial testing completed.",
        "details": {"tds_ppm": 820, "potability": "Poor", "sensor_count": 4},
    }
    contrib_res = await client.post(f"/api/v1/collaborations/{collab_id}/contributions", json=contrib_payload)
    assert contrib_res.status_code == 200
    updated_collab = contrib_res.json()["data"]
    assert updated_collab["status"] == CollaborationStatus.ACTIVE.value
    assert len(updated_collab["contributions"]) == 1
    assert updated_collab["contributions"][0]["type"] == "Research Milestone"

    # 4. List Collaborations for issue
    list_res = await client.get(f"/api/v1/collaborations/issue/{issue_id}")
    assert list_res.status_code == 200
    assert len(list_res.json()["data"]) == 1
