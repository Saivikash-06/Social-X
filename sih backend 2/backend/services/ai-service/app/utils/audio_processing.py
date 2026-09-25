"""Audio processing and validation utilities."""

import os
import tempfile
from typing import Tuple
from app.config import settings
from app.utils.errors import MediaProcessingError


def validate_audio_file(filename: str, file_bytes: bytes) -> Tuple[str, str]:
    """Validates audio file extension and size."""
    if not file_bytes:
        raise MediaProcessingError("Audio byte stream is empty")

    ext = os.path.splitext(filename)[1].lower()
    if ext not in settings.ALLOWED_AUDIO_EXTENSIONS:
        raise MediaProcessingError(
            f"Unsupported audio format '{ext}'. Allowed formats: {settings.ALLOWED_AUDIO_EXTENSIONS}"
        )

    size_mb = len(file_bytes) / (1024 * 1024)
    if size_mb > settings.MAX_AUDIO_SIZE_MB:
        raise MediaProcessingError(
            f"Audio file size ({size_mb:.2f} MB) exceeds maximum allowed ({settings.MAX_AUDIO_SIZE_MB} MB)"
        )

    return ext, filename


def save_temp_audio(file_bytes: bytes, suffix: str = ".wav") -> str:
    """Saves audio bytes to a temporary file on disk and returns the path."""
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(file_bytes)
        tmp.flush()
        return tmp.name
