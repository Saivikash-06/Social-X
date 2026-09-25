"""Multi-modal confidence aggregation and calibration utilities."""

from typing import List, Optional

try:
    from backend.shared.schemas.common import ConfidenceMetadata
except ImportError:
    from shared.schemas.common import ConfidenceMetadata

from app.config import settings


def aggregate_confidence(
    text_confidence: Optional[float] = None,
    vision_confidence: Optional[float] = None,
    ocr_confidence: Optional[float] = None,
    speech_confidence: Optional[float] = None,
    conflicting_signals: Optional[List[str]] = None,
) -> ConfidenceMetadata:
    """
    Computes a weighted, calibrated overall confidence score across active modalities.
    Checks if manual verification is required.
    """
    weights = {
        "text": 0.40,
        "vision": 0.35,
        "ocr": 0.15,
        "speech": 0.10,
    }

    scores = []
    active_weights = []

    if text_confidence is not None:
        scores.append(text_confidence * weights["text"])
        active_weights.append(weights["text"])

    if vision_confidence is not None:
        scores.append(vision_confidence * weights["vision"])
        active_weights.append(weights["vision"])

    if ocr_confidence is not None:
        scores.append(ocr_confidence * weights["ocr"])
        active_weights.append(weights["ocr"])

    if speech_confidence is not None:
        scores.append(speech_confidence * weights["speech"])
        active_weights.append(weights["speech"])

    if not scores:
        overall_score = 0.50
    else:
        total_weight = sum(active_weights)
        overall_score = round(sum(scores) / total_weight, 4)

    reasons: List[str] = []
    requires_verification = False

    # Check overall threshold
    if overall_score < settings.CONFIDENCE_VERIFICATION_THRESHOLD:
        requires_verification = True
        reasons.append(
            f"Overall confidence score ({overall_score:.2f}) is below acceptable threshold ({settings.CONFIDENCE_VERIFICATION_THRESHOLD:.2f})"
        )

    # Check individual modality degradation
    if text_confidence is not None and text_confidence < 0.60:
        reasons.append("Text understanding ambiguity or insufficient context in report")
    if vision_confidence is not None and vision_confidence < 0.60:
        reasons.append("Low visual clarity or ambiguous scene elements in uploaded image")
    if speech_confidence is not None and speech_confidence < 0.60:
        reasons.append("Audio recording has high background noise or unclear voice")

    # Conflicting signals
    if conflicting_signals:
        requires_verification = True
        reasons.extend(conflicting_signals)

    return ConfidenceMetadata(
        overall_score=overall_score,
        text_confidence=text_confidence,
        vision_confidence=vision_confidence,
        ocr_confidence=ocr_confidence,
        speech_confidence=speech_confidence,
        requires_manual_verification=requires_verification,
        reasons=reasons,
    )
