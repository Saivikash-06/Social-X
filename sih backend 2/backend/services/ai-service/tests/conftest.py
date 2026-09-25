"""Pytest fixtures and test setup for AI Service."""

import os
import sys
import io
import base64
import pytest
import numpy as np
import cv2
from fastapi.testclient import TestClient

# Ensure backend and ai-service root are on sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))

for path in [BASE_DIR, BACKEND_DIR, WORKSPACE_DIR]:
    if path not in sys.path:
        sys.path.insert(0, path)


@pytest.fixture
def sample_image_bytes() -> bytes:
    """Generates an in-memory sample image with OpenCV text."""
    img = np.zeros((300, 500, 3), dtype=np.uint8)
    # White background
    img[:] = (240, 240, 240)
    # Add signboard border
    cv2.rectangle(img, (20, 20), (480, 280), (50, 50, 50), 3)
    # Add text
    cv2.putText(img, "MUNICIPAL NOTICE", (40, 80), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 180), 2)
    cv2.putText(img, "ROAD REPAIR SECTOR 4", (40, 140), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (20, 20, 20), 2)
    cv2.putText(img, "PWD DEPT - CAUTION", (40, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 100, 0), 2)

    _, encoded = cv2.imencode(".png", img)
    return encoded.tobytes()


@pytest.fixture
def sample_image_base64(sample_image_bytes) -> str:
    """Generates base64 string of sample image."""
    return base64.b64encode(sample_image_bytes).decode("utf-8")


@pytest.fixture
def sample_audio_bytes() -> bytes:
    """Generates a minimal valid WAV audio file in memory."""
    import wave
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wav:
        wav.setnchannels(1)  # Mono
        wav.setsampwidth(2)  # 16-bit
        wav.setframerate(16000)  # 16kHz
        # 1 second of 440Hz sine wave tone
        duration = 1.0
        sample_rate = 16000
        t = np.linspace(0, duration, int(sample_rate * duration), False)
        tone = np.sin(2 * np.pi * 440 * t) * 32767
        data = tone.astype(np.int16).tobytes()
        wav.writeframes(data)
    return buf.getvalue()


@pytest.fixture
def sample_audio_base64(sample_audio_bytes) -> str:
    """Generates base64 string of sample audio."""
    return base64.b64encode(sample_audio_bytes).decode("utf-8")
