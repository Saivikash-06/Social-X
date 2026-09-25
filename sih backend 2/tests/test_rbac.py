"""Role-Based Access Control (RBAC) matrix tests."""

import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.core.security import create_access_token
from backend.core.database import db_manager

client = TestClient(app)


@pytest.fixture(autouse=True)
def seed_users():
    """Seeds test users for each role."""
    roles = ["CITIZEN", "STUDENT", "FACULTY", "INDUSTRY", "GOVERNMENT", "ADMIN"]
    for r in roles:
        user_id = f"user-{r.lower()}"
        email = f"{r.lower()}@test.socialx.org"
        user_doc = {
            "id": user_id,
            "email": email,
            "name": f"Test {r}",
            "role": r,
            "hashed_password": "dummy_hashed_pw",
            "is_active": True,
            "email_verified": True,
            "created_at": "2026-09-15T00:00:00Z",
            "updated_at": "2026-09-15T00:00:00Z",
        }
        db_manager._memory_store["users"][user_id] = user_doc



def get_token(role: str) -> str:
    user_id = f"user-{role.lower()}"
    email = f"{role.lower()}@test.socialx.org"
    return create_access_token(subject=user_id, email=email, role=role)


def test_industry_dashboard_authorization_matrix():
    """
    Validates strict RBAC on GET /api/industry/dashboard:
    - No token -> 401 Unauthorized
    - Invalid token -> 401 Unauthorized
    - Citizen -> 403 Forbidden
    - Student -> 403 Forbidden
    - Faculty -> 403 Forbidden
    - Government -> 403 Forbidden
    - Industry -> 200 OK
    - Admin -> 200 OK
    """
    endpoint = "/api/industry/dashboard"

    # 1. No token
    res = client.get(endpoint)
    assert res.status_code == 401

    # 2. Invalid token
    res = client.get(endpoint, headers={"Authorization": "Bearer fake.token.here"})
    assert res.status_code == 401

    # 3. Citizen token -> 403
    res = client.get(endpoint, headers={"Authorization": f"Bearer {get_token('CITIZEN')}"})
    assert res.status_code == 403

    # 4. Student token -> 403
    res = client.get(endpoint, headers={"Authorization": f"Bearer {get_token('STUDENT')}"})
    assert res.status_code == 403

    # 5. Faculty token -> 403
    res = client.get(endpoint, headers={"Authorization": f"Bearer {get_token('FACULTY')}"})
    assert res.status_code == 403

    # 6. Government token -> 403
    res = client.get(endpoint, headers={"Authorization": f"Bearer {get_token('GOVERNMENT')}"})
    assert res.status_code == 403

    # 7. Industry token -> 200 OK
    res = client.get(endpoint, headers={"Authorization": f"Bearer {get_token('INDUSTRY')}"})
    assert res.status_code == 200
    assert "portfolio" in res.json()

    # 8. Admin token -> 200 OK (Universal access)
    res = client.get(endpoint, headers={"Authorization": f"Bearer {get_token('ADMIN')}"})
    assert res.status_code == 200


def test_role_dashboards_access():
    """Verifies that each role can access its respective dashboard."""
    # Student dashboard
    res_student = client.get(
        "/api/student/dashboard",
        headers={"Authorization": f"Bearer {get_token('STUDENT')}"}
    )
    assert res_student.status_code == 200

    # Faculty dashboard
    res_faculty = client.get(
        "/api/faculty/dashboard",
        headers={"Authorization": f"Bearer {get_token('FACULTY')}"}
    )
    assert res_faculty.status_code == 200

    # Government dashboard
    res_govt = client.get(
        "/api/government/dashboard",
        headers={"Authorization": f"Bearer {get_token('GOVERNMENT')}"}
    )
    assert res_govt.status_code == 200

    # Admin dashboard
    res_admin = client.get(
        "/api/admin/dashboard",
        headers={"Authorization": f"Bearer {get_token('ADMIN')}"}
    )
    assert res_admin.status_code == 200
