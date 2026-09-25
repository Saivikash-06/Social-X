"""Request models for the AI Service endpoints."""

from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

try:
    from backend.shared.schemas.common import GeoLocation
    from backend.shared.enums.civic import IssueCategory, SeverityLevel
except ImportError:
    from shared.schemas.common import GeoLocation
    from shared.enums.civic import IssueCategory, SeverityLevel


class OCRExtractBase64Request(BaseModel):
    image_base64: str = Field(..., description="Base64-encoded image string")
    detect_orientation: bool = Field(True, description="Automatically correct orientation")


class SpeechTranscribeBase64Request(BaseModel):
    audio_base64: str = Field(..., description="Base64-encoded audio bytes")
    language: Optional[str] = Field(None, description="ISO language code or auto-detect")


class VisionAnalyzeBase64Request(BaseModel):
    image_base64: str = Field(..., description="Base64-encoded image string")
    context_hint: Optional[str] = Field(None, description="Optional textual context or category hint")


class NLPAnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=2, description="Citizen complaint / report text")
    language: Optional[str] = Field("auto", description="Source language if known")


class TranslationRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Text to be translated")
    source_language: Optional[str] = Field("auto", description="Source language (e.g., 'hi', 'mr', 'ta')")
    target_language: str = Field("en", description="Target language (defaults to 'en')")


class ClassificationRequest(BaseModel):
    text: str = Field(..., description="Issue description or extracted text")
    ocr_text: Optional[str] = Field(None, description="Supplementary OCR text")
    visual_tags: Optional[List[str]] = Field(default_factory=list, description="Visual tags from image analysis")


class PriorityDetectionRequest(BaseModel):
    category: Optional[IssueCategory] = Field(None, description="Detected or selected category")
    text: str = Field(..., description="Report description")
    visual_hazards: Optional[List[str]] = Field(default_factory=list)
    visual_severity: Optional[SeverityLevel] = Field(None)
    population_density: Optional[str] = Field("MEDIUM", description="HIGH, MEDIUM, or LOW")


class SummaryGenerationRequest(BaseModel):
    category: str = Field(..., description="Civic category")
    text: str = Field(..., description="Report description / transcription")
    location_name: Optional[str] = Field(None, description="Location / landmark name")
    visual_findings: Optional[List[str]] = Field(default_factory=list)


class PipelineProcessJsonRequest(BaseModel):
    text: Optional[str] = Field(None, description="Citizen text description")
    image_base64: Optional[str] = Field(None, description="Base64 encoded image")
    audio_base64: Optional[str] = Field(None, description="Base64 encoded audio")
    location: Optional[GeoLocation] = Field(None, description="GPS and address details")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)
