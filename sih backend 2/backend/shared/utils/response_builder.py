"""Shared utility for building uniform enterprise API responses."""

from typing import Any, Optional
from backend.shared.schemas.response import (
    StandardResponse,
    ErrorResponse,
    APIErrorDetail,
)


def success_response(
    data: Any = None,
    message: str = "Operation completed successfully",
    trace_id: Optional[str] = None,
) -> dict:
    resp = StandardResponse(data=data, message=message)
    if trace_id:
        resp.trace_id = trace_id
    return resp.model_dump()


def error_response(
    code: str,
    message: str,
    details: Optional[Any] = None,
    trace_id: Optional[str] = None,
) -> dict:
    err_detail = APIErrorDetail(code=code, message=message, details=details)
    resp = ErrorResponse(error=err_detail)
    if trace_id:
        resp.trace_id = trace_id
    return resp.model_dump()
