"""Standardized API response envelopes for all microservices."""

from datetime import datetime
from typing import Any, Generic, Optional, TypeVar
from uuid import uuid4
from pydantic import BaseModel, Field

T = TypeVar("T")


class APIErrorDetail(BaseModel):
    code: str = Field(..., description="Machine-readable error code")
    message: str = Field(..., description="Human-readable error explanation")
    details: Optional[Any] = Field(None, description="Detailed validation errors or context")


class StandardResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: str = "Operation completed successfully"
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    trace_id: str = Field(default_factory=lambda: str(uuid4()))


class ErrorResponse(BaseModel):
    success: bool = False
    error: APIErrorDetail
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    trace_id: str = Field(default_factory=lambda: str(uuid4()))
