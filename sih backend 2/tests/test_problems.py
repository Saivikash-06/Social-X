"""Unit tests for Problem submission and listing endpoints."""

import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.core.security import create_access_token
from backend.core.database import db_manager

client = TestClient(app)


@pytest.fixture(autouse=True)
def seed_citizen():
    """Seeds a citizen user for problem reporting."""
    user_doc = {
        "id": "citizen-123",
        "email": "reporter@example.com",
        "name": "Arun Kumar",
        "role": "CITIZEN",
        "hashed_password": "dummy_password",
        "is_active": True,
        "email_verified": True,
        "created_at": "2026-09-15T00:00:00Z",
        "updated_at": "2026-09-15T00:00:00Z",
    }
    db_manager._memory_store["users"]["citizen-123"] = user_doc



def citizen_token() -> str:
    return create_access_token(
        subject="citizen-123",
        email="reporter@example.com",
        role="CITIZEN",
    )


def test_create_problem_unauthorized():
    """Ensures unauthenticated requests to create problems are rejected with 401."""
    payload = {
        "title": "Severe Pothole on MG Road",
        "description": "Deep dangerous cavity causing vehicle damage near Metro Pillar 45.",
        "category": "ROADS_AND_TRANSPORT",
    }
    response = client.post("/api/problems", json=payload)
    assert response.status_code == 401


def test_create_problem_success():
    """Tests successful problem submission with automated department & SLA routing."""
    token = citizen_token()
    payload = {
        "title": "Severe Pothole on MG Road",
        "description": "Deep dangerous cavity causing vehicle damage near Metro Pillar 45.",
        "category": "ROADS_AND_TRANSPORT",
        "priority": "HIGH",
        "location": {
            "latitude": 12.9716,
            "longitude": 77.5946,
            "address": "MG Road, Bengaluru",
            "city": "Bengaluru",
            "state": "Karnataka",
            "postal_code": "560001",
        },
        "evidence_urls": ["https://s3.socialx.org/evidence/pothole1.jpg"],
    }
    response = client.post(
        "/api/problems",
        json=payload,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["citizen_name"] == "Arun Kumar"
    assert data["assigned_department"] == "PUBLIC_WORKS_DEPARTMENT"
    assert data["sla_hours"] == 48  # HIGH priority SLA
    assert "id" in data


def test_list_and_get_problem():
    """Tests retrieving problem listing and single problem details."""
    token = citizen_token()
    # Create a problem first
    create_res = client.post(
        "/api/problems",
        json={
            "title": "Sewage Leakage Sector 9",
            "description": "Overflown manhole releasing foul wastewater onto pedestrian path.",
            "category": "WATER_AND_SEWAGE",
            "priority": "CRITICAL",
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert create_res.status_code == 201
    created_id = create_res.json()["id"]

    # List problems
    list_res = client.get("/api/problems")
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

    # Get single problem
    get_res = client.get(f"/api/problems/{created_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == created_id
    assert get_res.json()["assigned_department"] == "WATER_AND_SEWERAGE_BOARD"


def test_get_nonexistent_problem():
    """Tests 404 response for invalid problem ID."""
    response = client.get("/api/problems/non-existent-id-999")
    assert response.status_code == 404
