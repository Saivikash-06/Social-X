"""Unit and integration tests for Authentication system."""

import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_register_citizen():
    """Registers a new citizen user."""
    payload = {
        "email": "priya.sharma@example.com",
        "password": "Password123!",
        "name": "Priya Sharma",
        "role": "CITIZEN",
        "phone_number": "+919876543210",
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "priya.sharma@example.com"
    assert data["user"]["role"] == "CITIZEN"


def test_register_duplicate_email():
    """Ensures duplicate email registration fails with 400 Bad Request."""
    payload = {
        "email": "duplicate.user@example.com",
        "password": "Password123!",
        "name": "First User",
        "role": "CITIZEN",
    }
    res1 = client.post("/api/auth/register", json=payload)
    assert res1.status_code == 201

    # Attempt duplicate registration
    res2 = client.post("/api/auth/register", json=payload)
    assert res2.status_code == 400
    assert "already exists" in res2.json()["detail"]


def test_register_admin_disallowed():
    """Ensures public registration cannot claim the ADMIN role."""
    payload = {
        "email": "hacker.admin@example.com",
        "password": "Password123!",
        "name": "Attacker",
        "role": "ADMIN",
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 403


def test_login_success():
    """Tests successful login with correct credentials."""
    email = "login.test@example.com"
    password = "SecurePassword456!"
    client.post(
        "/api/auth/register",
        json={"email": email, "password": password, "name": "Login Test", "role": "CITIZEN"}
    )

    response = client.post("/api/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == email


def test_login_invalid_password():
    """Tests login rejection on incorrect password."""
    response = client.post(
        "/api/auth/login",
        json={"email": "login.test@example.com", "password": "WrongPassword!"}
    )
    assert response.status_code == 401


def test_get_me_authenticated():
    """Tests /api/auth/me returns the current authenticated user profile."""
    email = "me.profile@example.com"
    password = "SecurePassword456!"
    reg_resp = client.post(
        "/api/auth/register",
        json={"email": email, "password": password, "name": "Me User", "role": "CITIZEN"}
    )
    token = reg_resp.json()["access_token"]

    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == email


def test_get_me_unauthorized():
    """Tests /api/auth/me rejects requests without token or with invalid token."""
    res_no_token = client.get("/api/auth/me")
    assert res_no_token.status_code == 401

    res_invalid_token = client.get(
        "/api/auth/me",
        headers={"Authorization": "Bearer totally-invalid-token"}
    )
    assert res_invalid_token.status_code == 401
