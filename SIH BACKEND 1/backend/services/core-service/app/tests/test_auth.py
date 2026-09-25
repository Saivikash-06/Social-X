import pytest
import uuid

@pytest.mark.asyncio
async def test_register_user(client):
    test_email = f"test_{uuid.uuid4()}@example.com"
    response = await client.post(
        "/api/v1/auth/register",
        json={"email": test_email, "password": "password123", "role": "CITIZEN"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == test_email
    assert "id" in data
    
@pytest.mark.asyncio
async def test_login_user(client):
    test_email = f"login_{uuid.uuid4()}@example.com"
    # Register first
    await client.post(
        "/api/v1/auth/register",
        json={"email": test_email, "password": "password123", "role": "CITIZEN"}
    )
    
    # Login
    response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_email, "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
