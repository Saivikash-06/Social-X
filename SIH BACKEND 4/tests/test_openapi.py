import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_openapi_schema(async_client: AsyncClient):
    response = await async_client.get("/openapi.json")
    assert response.status_code == 200
    schema = response.json()

    assert "paths" in schema
    paths = schema["paths"]

    # Assert presence of all required endpoints in Swagger schema
    required_endpoints = [
        "/dashboard/admin",
        "/dashboard/gov",
        "/dashboard/university",
        "/dashboard/industry",
        "/dashboard/citizen",
        "/analytics",
        "/reports",
        "/notify/email",
        "/notify/system",
        "/health"
    ]
    for ep in required_endpoints:
        assert ep in paths, f"Endpoint {ep} missing from OpenAPI schema"


@pytest.mark.asyncio
async def test_swagger_ui_docs(async_client: AsyncClient):
    response = await async_client.get("/docs")
    assert response.status_code == 200
    assert "Swagger UI" in response.text or "swagger" in response.text.lower()


@pytest.mark.asyncio
async def test_redoc(async_client: AsyncClient):
    response = await async_client.get("/redoc")
    assert response.status_code == 200
    assert "redoc" in response.text.lower()
