import pytest
import uuid

@pytest.mark.asyncio
async def test_get_users_me(client):
    test_email = f"user_{uuid.uuid4()}@example.com"
    # Register first
    await client.post(
        "/api/v1/auth/register",
        json={"email": test_email, "password": "password123", "role": "CITIZEN"}
    )
    
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_email, "password": "password123"}
    )
    access_token = login_response.json()["access_token"]
    
    # Get Profile
    response = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_email
    assert data["role"] == "CITIZEN"

@pytest.mark.asyncio
async def test_update_users_me(client):
    test_email = f"user_update_{uuid.uuid4()}@example.com"
    # Register first
    await client.post(
        "/api/v1/auth/register",
        json={"email": test_email, "password": "password123", "role": "CITIZEN"}
    )
    
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_email, "password": "password123"}
    )
    access_token = login_response.json()["access_token"]
    
    # Update Profile
    response = await client.put(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {access_token}"},
        json={"full_name": "New Name", "phone_number": "1234567890"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "New Name"
    assert data["phone_number"] == "1234567890"

@pytest.mark.asyncio
async def test_admin_get_users(client):
    admin_email = f"admin_{uuid.uuid4()}@example.com"
    # Register admin
    await client.post(
        "/api/v1/auth/register",
        json={"email": admin_email, "password": "password123", "role": "ADMIN"}
    )
    
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": admin_email, "password": "password123"}
    )
    access_token = login_response.json()["access_token"]
    
    # Get Users
    response = await client.get(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

@pytest.mark.asyncio
async def test_citizen_cannot_get_users(client):
    citizen_email = f"citizen_{uuid.uuid4()}@example.com"
    # Register citizen
    await client.post(
        "/api/v1/auth/register",
        json={"email": citizen_email, "password": "password123", "role": "CITIZEN"}
    )
    
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": citizen_email, "password": "password123"}
    )
    access_token = login_response.json()["access_token"]
    
    # Try Get Users
    response = await client.get(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 403
