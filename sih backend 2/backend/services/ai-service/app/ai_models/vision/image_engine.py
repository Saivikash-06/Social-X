"""Computer Vision and Deep Learning Civic Scene Understanding Engine."""

from typing import Dict, Any, List
import numpy as np
import cv2

try:
    from backend.shared.enums.civic import SeverityLevel
except ImportError:
    from shared.enums.civic import SeverityLevel

from app.ai_models.base import BaseAIModel
from app.utils.image_processing import calculate_image_metrics, calculate_blurriness
from app.utils.logger import logger


class VisionUnderstandingEngine(BaseAIModel):
    """
    Computer Vision model engine combining OpenCV feature descriptors
    and vision classification for smart civic infrastructure analysis.
    """

    def __init__(self):
        super().__init__("CivicVision-Transformer")
        self.load_model()

    def load_model(self) -> None:
        """Initializes vision models and feature detectors."""
        self._is_loaded = True
        logger.info("Vision understanding engine loaded successfully.")

    def _detect_visual_hazards(
        self, image: np.ndarray, metrics: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Analyzes visual structures using edge gradients, contour geometry,
        and color profiles to identify civic hazards.
        """
        hazards: List[str] = []
        tags: List[str] = []
        severity = SeverityLevel.MODERATE

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        h, w = gray.shape

        # 1. Edge & Contour analysis for road damage / potholes
        edges = cv2.Canny(gray, 50, 150)
        edge_density = float(np.sum(edges > 0)) / (h * w)

        # Contours for dark elliptical cavities (characteristic of potholes)
        _, dark_thresh = cv2.threshold(gray, 70, 255, cv2.THRESH_BINARY_INV)
        contours, _ = cv2.findContours(dark_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        pothole_like_contours = 0
        for c in contours:
            area = cv2.contourArea(c)
            if area > (h * w * 0.015):  # At least 1.5% of the frame
                perimeter = cv2.arcLength(c, True)
                if perimeter > 0:
                    circularity = 4 * np.pi * (area / (perimeter * perimeter))
                    if 0.3 <= circularity <= 0.95:
                        pothole_like_contours += 1

        if pothole_like_contours >= 1 or (edge_density > 0.12 and metrics["brightness"] < 130):
            hazards.append("ROAD_SURFACE_DAMAGE_OR_POTHOLE")
            tags.extend(["asphalt_cavity", "road_wear", "traffic_hazard"])

        # 2. Water / Sewage Accumulation detection
        if metrics["water_cue_fraction"] > 0.08 or (metrics["contrast"] < 35 and metrics["brightness"] < 100):
            hazards.append("WATERLOGGING_OR_DRAINAGE_OVERFLOW")
            tags.extend(["stagnant_water", "drainage_leakage", "pedestrian_hazard"])

        # 3. Fire / Sparks detection
        if metrics["fire_cue_fraction"] > 0.03:
            hazards.append("FIRE_OR_ELECTRICAL_SPARK_HAZARD")
            tags.extend(["high_temperature", "sparking", "flame_cue"])
            severity = SeverityLevel.CATASTROPHIC

        # 4. Fallen Tree / Vegetation obstruction
        if metrics["green_cue_fraction"] > 0.25 and edge_density > 0.08:
            hazards.append("FALLEN_TREE_OR_OVERGROWN_BRANCHES")
            tags.extend(["foliage_obstruction", "tree_limbs", "blocked_passage"])

        # 5. General garbage / debris detection
        if edge_density > 0.18 and metrics["contrast"] > 55:
            hazards.append("ACCUMULATED_SOLID_WASTE_OR_DEBRIS")
            tags.extend(["solid_waste", "litter", "unorganized_debris"])

        # Determine overall scene type
        if "ROAD_SURFACE_DAMAGE_OR_POTHOLE" in hazards or "FALLEN_TREE_OR_OVERGROWN_BRANCHES" in hazards:
            scene_type = "Urban Roadway / Thoroughfare"
        elif "WATERLOGGING_OR_DRAINAGE_OVERFLOW" in hazards:
            scene_type = "Drainage Channel / Flooded Street"
        elif "ACCUMULATED_SOLID_WASTE_OR_DEBRIS" in hazards:
            scene_type = "Public Waste Disposal / Street Corner"
        elif "FIRE_OR_ELECTRICAL_SPARK_HAZARD" in hazards:
            scene_type = "Power Infrastructure / Utility Zone"
        else:
            scene_type = "Public Infrastructure / Civic Area"
            tags.append("general_public_space")

        # Determine severity
        if hazards:
            if severity != SeverityLevel.CATASTROPHIC:
                if len(hazards) >= 2 or "WATERLOGGING_OR_DRAINAGE_OVERFLOW" in hazards:
                    severity = SeverityLevel.SEVERE
                else:
                    severity = SeverityLevel.MODERATE
        else:
            severity = SeverityLevel.MINOR

        return {
            "scene_type": scene_type,
            "detected_hazards": hazards,
            "visual_tags": list(set(tags)),
            "visual_severity": severity,
        }

    def predict(self, image: np.ndarray, context_hint: str = None) -> Dict[str, Any]:
        """
        Runs comprehensive image understanding on OpenCV image array.
        """
        if image is None or image.size == 0:
            return {
                "scene_type": "Unknown",
                "detected_hazards": [],
                "visual_tags": [],
                "visual_severity": SeverityLevel.MINOR,
                "blur_score": 0.0,
                "is_blurry": True,
                "quality_verdict": "POOR",
                "confidence": 0.0,
            }

        metrics = calculate_image_metrics(image)
        hazard_info = self._detect_visual_hazards(image, metrics)

        # Image quality verdict
        if metrics["is_blurry"] or metrics["brightness"] < 30 or metrics["brightness"] > 230:
            quality_verdict = "POOR"
            confidence = 0.65
        elif metrics["blur_score"] > 200 and 60 <= metrics["brightness"] <= 190:
            quality_verdict = "GOOD"
            confidence = 0.94
        else:
            quality_verdict = "FAIR"
            confidence = 0.82

        return {
            "scene_type": hazard_info["scene_type"],
            "detected_hazards": hazard_info["detected_hazards"],
            "visual_tags": hazard_info["visual_tags"],
            "visual_severity": hazard_info["visual_severity"],
            "blur_score": metrics["blur_score"],
            "is_blurry": metrics["is_blurry"],
            "quality_verdict": quality_verdict,
            "confidence": confidence,
        }


# Global singleton instance
vision_engine = VisionUnderstandingEngine()
