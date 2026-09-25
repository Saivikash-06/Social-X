from datetime import datetime, timezone
from typing import Any, Dict, Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field
from fastapi.responses import JSONResponse

T = TypeVar("T")


class ResponseMeta(BaseModel):
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    version: str = "v1"
    requestId: Optional[str] = None
    count: Optional[int] = None
    page: Optional[int] = None
    pageSize: Optional[int] = None
    totalPages: Optional[int] = None


class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[T] = None
    meta: ResponseMeta = Field(default_factory=ResponseMeta)


class ErrorDetail(BaseModel):
    field: Optional[str] = None
    message: str
    type: Optional[str] = None


class ErrorPayload(BaseModel):
    code: str
    message: str
    details: Optional[List[ErrorDetail]] = None


class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorPayload
    meta: ResponseMeta = Field(default_factory=ResponseMeta)


def success_response(
    data: Any = None,
    message: str = "Operation completed successfully",
    status_code: int = 200,
    meta: Optional[Dict[str, Any]] = None,
) -> JSONResponse:
    res_meta = ResponseMeta()
    if meta:
        for k, v in meta.items():
            if hasattr(res_meta, k):
                setattr(res_meta, k, v)

    payload = ApiResponse(
        success=True,
        message=message,
        data=data,
        meta=res_meta
    ).model_dump(by_alias=True)

    return JSONResponse(status_code=status_code, content=payload)


def error_response(
    message: str,
    code: str = "BAD_REQUEST",
    status_code: int = 400,
    details: Optional[List[Dict[str, Any]]] = None,
) -> JSONResponse:
    err_details = None
    if details:
        err_details = [ErrorDetail(**d) for d in details]

    payload = ErrorResponse(
        success=False,
        error=ErrorPayload(
            code=code,
            message=message,
            details=err_details
        ),
        meta=ResponseMeta()
    ).model_dump(by_alias=True)

    return JSONResponse(status_code=status_code, content=payload)
