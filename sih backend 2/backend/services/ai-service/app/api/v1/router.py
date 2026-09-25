"""API v1 master router."""

from fastapi import APIRouter
from app.api.v1.endpoints.ocr import router as ocr_router
from app.api.v1.endpoints.speech import router as speech_router

api_v1_router = APIRouter()
api_v1_router.include_router(ocr_router)
api_v1_router.include_router(speech_router)
