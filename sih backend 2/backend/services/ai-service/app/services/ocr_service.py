"""OCR application service."""

import base64
from typing import Optional
from app.ai_models.ocr.paddle_engine import ocr_engine
from app.schemas.ai_responses import OCRExtractResponse, BoundingBox
from app.utils.image_processing import load_image_from_bytes, calculate_blurriness
from app.utils.logger import logger
from app.utils.errors import InvalidInputError


class OCRService:
    """Coordinates image validation, OpenCV enhancement, and OCR extraction."""

    def __init__(self):
        self.engine = ocr_engine

    async def extract_from_bytes(self, image_bytes: bytes) -> OCRExtractResponse:
        """Processes raw image bytes through OCR pipeline."""
        if not image_bytes:
            raise InvalidInputError("No image data provided for OCR extraction.")

        cv_img = load_image_from_bytes(image_bytes)
        blur_var, is_blurry = calculate_blurriness(cv_img)
        logger.info(f"Processing OCR on image shape {cv_img.shape}, blur variance={blur_var:.2f}")

        res = self.engine.predict(cv_img)

        # Calibrate confidence if image is excessively blurry
        adjusted_conf = res["confidence"]
        if is_blurry:
            adjusted_conf = round(adjusted_conf * 0.85, 4)

        boxes = [BoundingBox(**b) for b in res["bounding_boxes"]]

        return OCRExtractResponse(
            extracted_text=res["extracted_text"],
            line_count=res["line_count"],
            word_count=res["word_count"],
            bounding_boxes=boxes,
            detected_language=res["detected_language"],
            confidence=adjusted_conf,
        )

    async def extract_from_base64(self, image_base64: str) -> OCRExtractResponse:
        """Decodes base64 string and processes through OCR pipeline."""
        if not image_base64:
            raise InvalidInputError("Empty base64 image string provided.")

        try:
            # Strip data url prefix if present (e.g. data:image/png;base64,...)
            if "," in image_base64:
                image_base64 = image_base64.split(",")[1]
            raw_bytes = base64.b64decode(image_base64)
        except Exception as e:
            raise InvalidInputError(f"Failed to decode base64 image: {str(e)}")

        return await self.extract_from_bytes(raw_bytes)


ocr_service = OCRService()
