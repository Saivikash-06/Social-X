"""Canonical Structured Civic Issue schema."""

from typing import Any, Optional
from pydantic import BaseModel, Field
from backend.shared.enums.civic import (
    IssueCategory,
    SubCategory,
    PriorityLevel,
    SeverityLevel,
    ResponsibleDepartment,
    StakeholderRole,
)
from backend.shared.schemas.common import GeoLocation, ConfidenceMetadata


class StructuredIssueReport(BaseModel):
    title: str = Field(..., description="Concise, actionable issue title")
    executive_summary: str = Field(..., description="High-level summary for authorities")
    actionable_task_description: str = Field(
        ...,
        description="Structured problem statement tailored for universities/startups/CSR partners"
    )
    key_bullet_points: list[str] = Field(default_factory=list, description="Key aspects of the issue")

    primary_category: IssueCategory = Field(..., description="Primary classification domain")
    sub_category: SubCategory = Field(..., description="Fine-grained issue subtype")
    secondary_categories: list[IssueCategory] = Field(default_factory=list)

    priority_level: PriorityLevel = Field(..., description="Operational priority level (P1-P4)")
    priority_score: float = Field(..., ge=0.0, le=1.0, description="Normalized risk score")
    severity_level: SeverityLevel = Field(..., description="Severity of impact")
    recommended_sla_hours: int = Field(..., description="Expected resolution timeline in hours")
    risk_factors: list[str] = Field(default_factory=list, description="Key risk drivers")

    recommended_department: ResponsibleDepartment = Field(
        ...,
        description="Primary government agency responsible"
    )
    collaborative_stakeholders: list[StakeholderRole] = Field(
        default_factory=list,
        description="Potential non-government collaborative partners"
    )

    location: Optional[GeoLocation] = Field(None, description="Extracted or provided geolocation")
    extracted_entities: dict[str, list[str]] = Field(
        default_factory=dict,
        description="Named entities (landmarks, locations, dates, contacts)"
    )

    # Multi-modal extraction summaries
    ocr_extracted_text: Optional[str] = Field(None, description="Text extracted from image via OCR")
    speech_transcription: Optional[str] = Field(None, description="Original speech transcript if audio provided")
    translated_text: Optional[str] = Field(None, description="English translation if input was regional")
    source_language: Optional[str] = Field(None, description="Detected source language")
    detected_visual_hazards: list[str] = Field(default_factory=list)

    confidence: ConfidenceMetadata = Field(..., description="Comprehensive multi-modal confidence assessment")
    raw_input_metadata: dict[str, Any] = Field(default_factory=dict)
