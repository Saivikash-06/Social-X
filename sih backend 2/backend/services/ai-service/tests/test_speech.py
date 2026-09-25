"""Unit tests for Speech-to-Text service and endpoints."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_speech_transcribe_multipart(sample_audio_bytes):
    """Tests POST /api/v1/speech/transcribe with WAV file."""
    response = client.post(
        "/api/v1/speech/transcribe",
        files={"file": ("voice_note.wav", sample_audio_bytes, "audio/wav")},
        data={"language": "hi"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data
    res_data = data["data"]
    assert "transcription" in res_data
    assert isinstance(res_data["transcription"], str)
    assert "duration_seconds" in res_data
    assert res_data["duration_seconds"] > 0
    assert "segments" in res_data
    assert "confidence" in res_data


def test_speech_transcribe_base64(sample_audio_base64):
    """Tests POST /api/v1/speech/transcribe-base64 with JSON payload."""
    response = client.post(
        "/api/v1/speech/transcribe-base64",
        json={"audio_base64": sample_audio_base64, "language": "hi"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"]["transcription"], str)


def test_speech_invalid_format(sample_image_bytes):
    """Tests POST /api/v1/speech/transcribe with disallowed file type (.png)."""
    response = client.post(
        "/api/v1/speech/transcribe",
        files={"file": ("image.png", sample_image_bytes, "image/png")}
    )
    assert response.status_code in [400, 422]
    data = response.json()
    assert data["success"] is False
    assert "error" in data
