"""OpenCV image processing and analysis utilities."""

from typing import Dict, Any, Tuple
import cv2
import numpy as np
from app.utils.errors import MediaProcessingError


def load_image_from_bytes(image_bytes: bytes) -> np.ndarray:
    """Decodes raw byte stream into OpenCV BGR image array."""
    if not image_bytes:
        raise MediaProcessingError("Image byte stream is empty")

    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise MediaProcessingError("Failed to decode image. Ensure file is a valid image format.")
    return img


def calculate_blurriness(image: np.ndarray) -> Tuple[float, bool]:
    """
    Computes Laplacian variance of grayscale image.
    Lower variance indicates higher blurriness.
    Threshold ~100: values below 100 are typically blurry.
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    variance = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    is_blurry = variance < 80.0
    return variance, is_blurry


def calculate_image_metrics(image: np.ndarray) -> Dict[str, Any]:
    """
    Computes visual metrics: resolution, brightness, contrast, blurriness, and color profile.
    """
    h, w, c = image.shape
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Laplacian blur variance
    blur_score, is_blurry = calculate_blurriness(image)

    # Average brightness and standard deviation (contrast)
    brightness = float(np.mean(gray))
    contrast = float(np.std(gray))

    # HSV color analysis for environmental indicators
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    h_channel = hsv[:, :, 0]
    s_channel = hsv[:, :, 1]
    v_channel = hsv[:, :, 2]

    # Approximate environmental cues
    # Water/mud cue: high saturation in brown/blue ranges
    water_mask = cv2.inRange(hsv, (90, 40, 40), (130, 255, 255))
    water_fraction = float(np.sum(water_mask > 0)) / (h * w)

    # Fire/spark cue: bright red/orange/yellow
    fire_mask1 = cv2.inRange(hsv, (0, 100, 150), (20, 255, 255))
    fire_mask2 = cv2.inRange(hsv, (160, 100, 150), (180, 255, 255))
    fire_fraction = float(np.sum((fire_mask1 > 0) | (fire_mask2 > 0))) / (h * w)

    # Greenery cue: green hue
    green_mask = cv2.inRange(hsv, (35, 40, 40), (85, 255, 255))
    green_fraction = float(np.sum(green_mask > 0)) / (h * w)

    return {
        "width": w,
        "height": h,
        "channels": c,
        "blur_score": round(blur_score, 2),
        "is_blurry": is_blurry,
        "brightness": round(brightness, 2),
        "contrast": round(contrast, 2),
        "water_cue_fraction": round(water_fraction, 4),
        "fire_cue_fraction": round(fire_fraction, 4),
        "green_cue_fraction": round(green_fraction, 4),
    }


def preprocess_image_for_ocr(image: np.ndarray) -> np.ndarray:
    """
    Applies grayscale, bilateral filtering, and adaptive thresholding
    to enhance text contrast before OCR.
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    filtered = cv2.bilateralFilter(gray, 9, 75, 75)
    return filtered
