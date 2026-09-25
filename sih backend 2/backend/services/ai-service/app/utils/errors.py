"""Custom exceptions and error handlers for the AI Service."""

from typing import Any, Optional
from fastapi import HTTPException, status


class AIServiceException(HTTPException):
    """Base exception for all AI Service specific errors."""

    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        details: Optional[Any] = None,
    ):
        super().__init__(status_code=status_code, detail=message)
        self.code = code
        self.message = message
        self.details = details


class MediaProcessingError(AIServiceException):
    def __init__(self, message: str, details: Optional[Any] = None):
        super().__init__(
            code="MEDIA_PROCESSING_ERROR",
            message=message,
            status_code=422,
            details=details,
        )


class ModelInferenceError(AIServiceException):
    def __init__(self, model_name: str, reason: str, details: Optional[Any] = None):
        super().__init__(
            code="MODEL_INFERENCE_ERROR",
            message=f"Error executing inference on model '{model_name}': {reason}",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            details=details,
        )


class InvalidInputError(AIServiceException):
    def __init__(self, message: str, details: Optional[Any] = None):
        super().__init__(
            code="INVALID_INPUT",
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details,
        )
