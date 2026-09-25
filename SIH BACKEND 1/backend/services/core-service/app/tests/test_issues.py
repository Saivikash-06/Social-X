import pytest
import uuid
from shared.constants.issues import IssueCategory, IssueSeverity, IssueStatus

@pytest.fixture
async def citizen_token(client):
    email = f"citizen_{uuid.uuid4()}@example.com"
    await client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123", "role": "CITIZEN"}
    )
    res = await client.post(
        "/api/v1/auth/login",
        data={"username": email, "password": "password123"}
    )
    return res.json()["access_token"]

@pytest.fixture
async def admin_token(client):
    email = f"admin_{uuid.uuid4()}@example.com"
    await client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123", "role": "ADMIN"}
    )
    res = await client.post(
        "/api/v1/auth/login",
        data={"username": email, "password": "password123"}
    )
    return res.json()["access_token"]

@pytest.mark.asyncio
async def test_create_issue(client, citizen_token):
    res = await client.post(
        "/api/v1/issues",
        headers={"Authorization": f"Bearer {citizen_token}"},
        json={
            "title": "Broken pipe",
            "description": "Water leaking",
            "category": IssueCategory.INFRASTRUCTURE,
            "severity": IssueSeverity.HIGH,
            "location": "Main St."
        }
    )
    if res.status_code != 201:
        print(res.json())
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == "Broken pipe"
    assert data["status"] == IssueStatus.OPEN
    assert data["id"] is not None

@pytest.mark.asyncio
async def test_get_issue_permissions(client, citizen_token, admin_token):
    # Citizen creates issue
    res = await client.post(
        "/api/v1/issues",
        headers={"Authorization": f"Bearer {citizen_token}"},
        json={
            "title": "Pothole",
            "description": "Big pothole",
            "category": IssueCategory.INFRASTRUCTURE
        }
    )
    issue_id = res.json()["id"]

    # Citizen can read their own issue
    res2 = await client.get(f"/api/v1/issues/{issue_id}", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res2.status_code == 200

    # Admin can read the issue
    res3 = await client.get(f"/api/v1/issues/{issue_id}", headers={"Authorization": f"Bearer {admin_token}"})
    assert res3.status_code == 200

    # Another citizen cannot read it
    email = f"citizen2_{uuid.uuid4()}@example.com"
    await client.post("/api/v1/auth/register", json={"email": email, "password": "password123", "role": "CITIZEN"})
    login = await client.post("/api/v1/auth/login", data={"username": email, "password": "password123"})
    citizen2_token = login.json()["access_token"]

    res4 = await client.get(f"/api/v1/issues/{issue_id}", headers={"Authorization": f"Bearer {citizen2_token}"})
    assert res4.status_code == 403

@pytest.mark.asyncio
async def test_add_media(client, citizen_token):
    # Citizen creates issue
    res = await client.post(
        "/api/v1/issues",
        headers={"Authorization": f"Bearer {citizen_token}"},
        json={
            "title": "Stray dogs",
            "description": "Lots of dogs",
            "category": IssueCategory.OTHER
        }
    )
    issue_id = res.json()["id"]
    
    # Add media
    media_res = await client.post(
        f"/api/v1/issues/{issue_id}/media",
        headers={"Authorization": f"Bearer {citizen_token}"},
        json={
            "url": "https://example.com/image.jpg",
            "media_type": "image/jpeg"
        }
    )
    assert media_res.status_code == 201
    assert media_res.json()["url"] == "https://example.com/image.jpg"
