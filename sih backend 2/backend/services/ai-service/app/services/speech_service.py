"""Speech-to-Text application service."""

import os
import base64
from typing import Optional
from app.ai_models.speech.whisper_engine import speech_engine
from app.schemas.ai_responses import SpeechTranscribeResponse, SpeechSegment
from app.utils.audio_processing import validate_audio_file, save_temp_audio
from app.utils.logger import logger
from app.utils.errors import InvalidInputError, MediaProcessingError


class SpeechService:
    """Coordinates audio validation, temporary storage, Whisper model execution, and cleanup."""

    def __init__(self):
        self.engine = speech_engine

    async def transcribe_from_bytes(
        self,
        filename: str,
        audio_bytes: bytes,
        language: Optional[str] = None,
    ) -> SpeechTranscribeResponse:
        """Validates and transcribes raw audio bytes."""
        if not audio_bytes:
            raise InvalidInputError("No audio data provided for transcription.")

        ext, _ = validate_audio_file(filename, audio_bytes)
        temp_path = save_temp_audio(audio_bytes, suffix=ext)
        logger.info(f"Processing audio transcription for {filename} ({len(audio_bytes)} bytes)")

        try:
            res = self.engine.predict(temp_path, language=language)
            segments = [SpeechSegment(**s) for s in res.get("segments", [])]

            return SpeechTranscribeResponse(
                transcription=res["transcription"],
                detected_language=res["detected_language"],
                duration_seconds=res["duration_seconds"],
                segments=segments,
                confidence=res["confidence"],
            )
        finally:
            # Always delete temp audio file
            if os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except Exception as e:
                    logger.warning(f"Failed to remove temp audio file {temp_path}: {e}")

    async def transcribe_from_base64(
        self,
        audio_base64: str,
        language: Optional[str] = None,
        default_ext: str = ".wav",
    ) -> SpeechTranscribeResponse:
        """Decodes base64 audio and runs transcription."""
        if not audio_base64:
            raise InvalidInputError("Empty base64 audio string provided.")

        try:
            if "," in audio_base64:
                audio_base64 = audio_base64.split(",")[1]
            raw_bytes = base64.b64decode(audio_base64)
        except Exception as e:
            raise InvalidInputError(f"Failed to decode base64 audio data: {str(e)}")

        return await self.transcribe_from_bytes(
            f"audio_payload{default_ext}",
            raw_bytes,
            language=language,
        )


speech_service = SpeechService()
