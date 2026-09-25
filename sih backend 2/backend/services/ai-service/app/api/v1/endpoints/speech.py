"""Speech-to-Text API endpoints."""

from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form, status

try:
    from backend.shared.schemas.response import StandardResponse
except ImportError:
    from shared.schemas.response import StandardResponse

from app.schemas.ai_requests import SpeechTranscribeBase64Request
from app.schemas.ai_responses import SpeechTranscribeResponse
from app.services.speech_service import speech_service

router = APIRouter(prefix="/speech", tags=["Speech To Text"])


@router.post(
    "/transcribe",
    response_model=StandardResponse[SpeechTranscribeResponse],
    status_code=status.HTTP_200_OK,
    summary="Transcribe audio file to text (Whisper)",
    description="Accepts multi-lingual audio (.wav, .mp3, .m4a, .ogg, .webm) and transcribes speech to text using Whisper.",
)
async def transcribe_audio_file(
    file: UploadFile = File(..., description="Audio file of citizen voice note"),
    language: Optional[str] = Form(None, description="Optional ISO language code or 'auto'"),
):
    contents = await file.read()
    result = await speech_service.transcribe_from_bytes(
        filename=file.filename or "audio.wav",
        audio_bytes=contents,
        language=language,
    )
    return StandardResponse(
        data=result,
        message="Audio transcribed successfully"
    )


@router.post(
    "/transcribe-base64",
    response_model=StandardResponse[SpeechTranscribeResponse],
    status_code=status.HTTP_200_OK,
    summary="Transcribe base64 encoded audio",
    description="Accepts JSON containing base64 encoded audio bytes and transcribes speech using Whisper.",
)
async def transcribe_audio_base64(
    request: SpeechTranscribeBase64Request
):
    result = await speech_service.transcribe_from_base64(
        audio_base64=request.audio_base64,
        language=request.language,
    )
    return StandardResponse(
        data=result,
        message="Base64 audio transcribed successfully"
    )
