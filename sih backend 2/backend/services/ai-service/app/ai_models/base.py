"""Abstract base class for all AI Model engines."""

from abc import ABC, abstractmethod
from typing import Any, Dict


class BaseAIModel(ABC):
    """Base interface for all AI models in the service."""

    def __init__(self, model_name: str):
        self.model_name = model_name
        self._is_loaded = False

    @abstractmethod
    def load_model(self) -> None:
        """Initializes and loads model weights or dependencies."""
        pass

    @abstractmethod
    def predict(self, *args: Any, **kwargs: Any) -> Dict[str, Any]:
        """Runs inference on given inputs and returns structured results."""
        pass

    @property
    def is_ready(self) -> bool:
        """Indicates whether the model is loaded and ready for inference."""
        return self._is_loaded
