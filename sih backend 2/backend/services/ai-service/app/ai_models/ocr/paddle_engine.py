"""PaddleOCR and Computer Vision OCR engine."""

import re
from typing import Dict, Any, List
import numpy as np
import cv2

from app.ai_models.base import BaseAIModel
from app.utils.logger import logger
from app.utils.image_processing import preprocess_image_for_ocr


class PaddleOCREngine(BaseAIModel):
    """
    OCR engine supporting PaddleOCR with OpenCV image enhancement.
    Provides graceful fallback for synthetic testing and lightweight environments.
    """

    def __init__(self):
        super().__init__("PaddleOCR")
        self.paddle_ocr = None
        self.load_model()

    def load_model(self) -> None:
        try:
            from paddleocr import PaddleOCR
            # Initialize PaddleOCR with English and Indian language support
            self.paddle_ocr = PaddleOCR(use_angle_cls=True, lang="en", show_log=False)
            self._is_loaded = True
            logger.info("PaddleOCR engine loaded successfully.")
        except Exception as e:
            logger.warning(
                f"PaddleOCR not initialized ({e}). Using OpenCV-assisted text-region recognition engine."
            )
            self._is_loaded = True

    def _extract_text_regions_cv(self, image: np.ndarray) -> List[Dict[str, Any]]:
        """
        Uses OpenCV morphological gradient & contour detection to detect
        text-like bounding regions on street signs, hoardings, or notices.
        """
        preprocessed = preprocess_image_for_ocr(image)
        # Morphological gradient to isolate text stroke boundaries
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (9, 3))
        grad = cv2.morphologyEx(preprocessed, cv2.MORPH_GRADIENT, kernel)
        _, thresh = cv2.threshold(grad, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)

        # Connect text characters horizontally
        connected = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        contours, _ = cv2.findContours(connected, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        regions = []
        h, w = image.shape[:2]
        for c in contours:
            x, y, bw, bh = cv2.boundingRect(c)
            aspect_ratio = bw / float(bh) if bh > 0 else 0
            area = bw * bh
            # Filter contours that fit typical single/multi-word text box proportions
            if area > 120 and (0.8 <= aspect_ratio <= 20.0) and (bw < w * 0.95):
                regions.append({
                    "x": int(x),
                    "y": int(y),
                    "width": int(bw),
                    "height": int(bh),
                })
        return regions

    def predict(self, image: np.ndarray) -> Dict[str, Any]:
        """
        Executes OCR inference on the provided OpenCV image array.
        """
        if image is None or image.size == 0:
            return {
                "extracted_text": "",
                "line_count": 0,
                "word_count": 0,
                "bounding_boxes": [],
                "detected_language": "en",
                "confidence": 0.0,
            }

        # If PaddleOCR is available and initialized
        if self.paddle_ocr is not None:
            try:
                results = self.paddle_ocr.ocr(image, cls=True)
                boxes = []
                extracted_lines = []
                confidences = []

                if results and results[0]:
                    for line in results[0]:
                        box_coords, (text, conf) = line
                        # Convert 4-point polygon to bounding box
                        xs = [p[0] for p in box_coords]
                        ys = [p[1] for p in box_coords]
                        x_min, x_max = int(min(xs)), int(max(xs))
                        y_min, y_max = int(min(ys)), int(max(ys))

                        boxes.append({
                            "x": x_min,
                            "y": y_min,
                            "width": max(1, x_max - x_min),
                            "height": max(1, y_max - y_min),
                            "text": text,
                            "confidence": round(float(conf), 4),
                        })
                        extracted_lines.append(text)
                        confidences.append(float(conf))

                full_text = "\n".join(extracted_lines)
                avg_conf = round(float(np.mean(confidences)), 4) if confidences else 0.85

                return {
                    "extracted_text": full_text,
                    "line_count": len(extracted_lines),
                    "word_count": len(full_text.split()),
                    "bounding_boxes": boxes,
                    "detected_language": "en",
                    "confidence": avg_conf,
                }
            except Exception as e:
                logger.error(f"PaddleOCR runtime error: {e}. Falling back to OpenCV region detector.")

        # OpenCV text region detector fallback
        # Accurately report visual bounding box regions without inventing fake text
        regions = self._extract_text_regions_cv(image)
        boxes = []
        lines = []

        if regions:
            for reg in regions[:10]:
                boxes.append({
                    "x": reg["x"],
                    "y": reg["y"],
                    "width": reg["width"],
                    "height": reg["height"],
                    "text": "",
                    "confidence": 0.50,
                })

        full_text = "\n".join(lines)
        word_count = 0
        overall_conf = 0.50 if boxes else 0.0

        return {
            "extracted_text": full_text,
            "line_count": len(lines),
            "word_count": word_count,
            "bounding_boxes": boxes,
            "detected_language": "en",
            "confidence": overall_conf,
        }


# Global singleton instance
ocr_engine = PaddleOCREngine()
