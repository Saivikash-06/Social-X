"""Response models for the AI Service endpoints."""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

try:
    from backend.shared.enums.civic import (
        IssueCategory,
        SubCategory,
        PriorityLevel,
        SeverityLevel,
        ResponsibleDepartment,
        StakeholderRole,
    )
    from backend.shared.schemas.common import ConfidenceMetadata
    from backend.shared.schemas.issue import StructuredIssueReport
except ImportError:
    from shared.enums.civic import (
        IssueCategory,
        SubCategory,
        PriorityLevel,
        SeverityLevel,
        ResponsibleDepartment,
        StakeholderRole,
    )
    from shared.schemas.common import ConfidenceMetadata
    from shared.schemas.issue import StructuredIssueReport


class BoundingBox(BaseModel):
    x: int
    y: int
    width: int
    height: int
    text: str
    confidence: float


class OCRExtractResponse(BaseModel):
    extracted_text: str = Field(..., description="Full text extracted from image")
    line_count: int
    word_count: int
    bounding_boxes: List[BoundingBox] = Field(default_factory=list)
    detected_language: Optional[str] = "en"
    confidence: float = Field(..., ge=0.0, le=1.0)


class SpeechSegment(BaseModel):
    start_second: float
    end_second: float
    text: str
    confidence: float


class SpeechTranscribeResponse(BaseModel):
    transcription: str = Field(..., description="Transcribed audio text")
    detected_language: str
    duration_seconds: float
    segments: List[SpeechSegment] = Field(default_factory=list)
    confidence: float = Field(..., ge=0.0, le=1.0)


class VisionAnalyzeResponse(BaseModel):
    scene_type: str = Field(..., description="Detected scene category (e.g., Road, Residential, Water Body)")
    detected_hazards: List[str] = Field(default_factory=list, description="Specific hazards visually observed")
    visual_tags: List[str] = Field(default_factory=list, description="Descriptive visual tags")
    visual_severity: SeverityLevel = Field(..., description="Estimated visual severity")
    blur_score: float = Field(..., description="Laplacian variance score")
    is_blurry: bool
    quality_verdict: str = Field("GOOD", description="GOOD, FAIR, POOR")
    confidence: float = Field(..., ge=0.0, le=1.0)


class ExtractedEntity(BaseModel):
    entity: str
    category: str  # LOCATION, LANDMARK, DATE_TIME, CONTACT, ORGANIZATION
    confidence: float


class NLPAnalyzeResponse(BaseModel):
    entities: Dict[str, List[str]] = Field(default_factory=dict)
    detailed_entities: List[ExtractedEntity] = Field(default_factory=list)
    intent: str = Field(..., description="COMPLAINT, EMERGENCY_ALERT, INQUIRY, FEEDBACK")
    sentiment: str = Field(..., description="NEGATIVE, NEUTRAL, POSITIVE")
    sentiment_score: float
    urgency_detected: bool
    urgency_keywords: List[str] = Field(default_factory=list)
    keywords: List[str] = Field(default_factory=list)
    confidence: float = Field(..., ge=0.0, le=1.0)


class TranslationResponse(BaseModel):
    original_text: str
    source_language: str
    target_language: str
    translated_text: str
    confidence: float = Field(..., ge=0.0, le=1.0)


class ClassificationResponse(BaseModel):
    primary_category: IssueCategory
    sub_category: SubCategory
    secondary_categories: List[IssueCategory] = Field(default_factory=list)
    category_scores: Dict[str, float] = Field(default_factory=dict)
    recommended_department: ResponsibleDepartment
    collaborative_stakeholders: List[StakeholderRole] = Field(default_factory=list)
    confidence: float = Field(..., ge=0.0, le=1.0)


class PriorityDetectionResponse(BaseModel):
    priority_level: PriorityLevel
    priority_score: float = Field(..., ge=0.0, le=1.0)
    severity_level: SeverityLevel
    recommended_sla_hours: int
    risk_factors: List[str] = Field(default_factory=list)
    confidence: float = Field(..., ge=0.0, le=1.0)


class SummaryGenerationResponse(BaseModel):
    title: str = Field(..., description="Short, actionable title")
    executive_summary: str = Field(..., description="Summary for government officials")
    actionable_task_description: str = Field(..., description="Technical task description for universities/CSR")
    key_bullet_points: List[str] = Field(default_factory=list)
    confidence: float = Field(..., ge=0.0, le=1.0)


class PipelineProcessResponse(BaseModel):
    issue_report: StructuredIssueReport
