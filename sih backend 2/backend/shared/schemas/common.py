"""Common base schemas shared across microservices."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class GeoLocation(BaseModel):
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0, description="Latitude in decimal degrees")
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0, description="Longitude in decimal degrees")
    address: Optional[str] = Field(None, description="Human-readable address or landmark")
    city: Optional[str] = Field(None, description="City name")
    state: Optional[str] = Field(None, description="State / Province")
    postal_code: Optional[str] = Field(None, description="Postal / PIN code")


class ConfidenceMetadata(BaseModel):
    overall_score: float = Field(..., ge=0.0, le=1.0, description="Normalized overall confidence score")
    text_confidence: Optional[float] = Field(None, ge=0.0, le=1.0)
    vision_confidence: Optional[float] = Field(None, ge=0.0, le=1.0)
    ocr_confidence: Optional[float] = Field(None, ge=0.0, le=1.0)
    speech_confidence: Optional[float] = Field(None, ge=0.0, le=1.0)
    requires_manual_verification: bool = Field(
        False,
        description="True if confidence is below threshold or conflicting signals exist"
    )
    reasons: list[str] = Field(default_factory=list, description="Reasons for confidence degradation or verification")
