"""OCR engine package."""

from app.ai_models.ocr.paddle_engine import PaddleOCREngine, ocr_engine

__all__ = ["PaddleOCREngine", "ocr_engine"]
