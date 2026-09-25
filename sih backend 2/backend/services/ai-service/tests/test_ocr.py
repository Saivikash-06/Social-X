"""Unit tests for OCR service and endpoints."""

import io
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_ocr_extract_multipart(sample_image_bytes):
    """Tests POST /api/v1/ocr/extract with multipart form data."""
    response = client.post(
        "/api/v1/ocr/extract",
        files={"file": ("test_signboard.png", sample_image_bytes, "image/png")}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data
    res_data = data["data"]
    assert "extracted_text" in res_data
    assert "confidence" in res_data
    assert res_data["confidence"] > 0.0
    assert "line_count" in res_data
    assert "bounding_boxes" in res_data


def test_ocr_extract_base64(sample_image_base64):
    """Tests POST /api/v1/ocr/extract-base64 with JSON payload."""
    response = client.post(
        "/api/v1/ocr/extract-base64",
        json={"image_base64": sample_image_base64}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["confidence"] > 0.0


def test_ocr_invalid_base64():
    """Tests POST /api/v1/ocr/extract-base64 with corrupt payload."""
    response = client.post(
        "/api/v1/ocr/extract-base64",
        json={"image_base64": "not-valid-base64@@@"}
    )
    assert response.status_code in [400, 422]
    data = response.json()
    assert data["success"] is False
    assert "error" in data
