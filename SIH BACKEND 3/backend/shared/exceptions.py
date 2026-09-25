from typing import Any, Optional


class AppException(Exception):
    """Base application exception."""
    def __init__(
        self,
        message: str,
        error_code: str = "INTERNAL_SERVER_ERROR",
        status_code: int = 500,
        details: Optional[Any] = None,
    ):
        super().__init__(message)
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details


class EntityNotFoundError(AppException):
    def __init__(self, entity_name: str, entity_id: Any):
        super().__init__(
            message=f"{entity_name} with identifier '{entity_id}' was not found.",
            error_code="ENTITY_NOT_FOUND",
            status_code=404,
        )


class InvalidStateTransitionError(AppException):
    def __init__(self, current_state: str, attempted_state: str, reason: str = ""):
        message = f"Invalid state transition from '{current_state}' to '{attempted_state}'."
        if reason:
            message += f" Reason: {reason}"
        super().__init__(
            message=message,
            error_code="INVALID_STATE_TRANSITION",
            status_code=400,
        )


class RuleConflictError(AppException):
    def __init__(self, message: str, details: Optional[Any] = None):
        super().__init__(
            message=message,
            error_code="RULE_CONFLICT",
            status_code=409,
            details=details,
        )


class ValidationException(AppException):
    def __init__(self, message: str, details: Optional[Any] = None):
        super().__init__(
            message=message,
            error_code="VALIDATION_FAILED",
            status_code=422,
            details=details,
        )


class UnauthorizedActionError(AppException):
    def __init__(self, message: str = "Action not permitted for this actor or department."):
        super().__init__(
            message=message,
            error_code="FORBIDDEN_ACTION",
            status_code=403,
        )
