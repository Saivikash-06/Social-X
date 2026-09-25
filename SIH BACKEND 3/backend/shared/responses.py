from typing import Any, Generic, List, Optional, TypeVar
from datetime import datetime, timezone
from pydantic import BaseModel, Field

DataT = TypeVar("DataT")


class APIResponse(BaseModel, Generic[DataT]):
    """Standard unified response wrapper for all API responses."""
    success: bool = Field(default=True, description="Indicates whether the request was successful")
    message: str = Field(default="Operation completed successfully", description="User-friendly status message")
    data: Optional[DataT] = Field(default=None, description="Response payload")
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="ISO 8601 UTC timestamp of the response",
    )


class PaginatedResponse(BaseModel, Generic[DataT]):
    """Standard paginated payload wrapper."""
    items: List[DataT] = Field(default_factory=list, description="List of items for current page")
    total: int = Field(default=0, description="Total number of items")
    page: int = Field(default=1, description="Current page number (1-indexed)")
    page_size: int = Field(default=20, description="Items per page")
    total_pages: int = Field(default=0, description="Total number of pages")


class APIErrorResponse(BaseModel):
    """Standard error response format."""
    success: bool = Field(default=False, description="Always False for error responses")
    error_code: str = Field(..., description="Machine-readable error identifier")
    message: str = Field(..., description="Human-readable error explanation")
    details: Optional[Any] = Field(default=None, description="Detailed validation or contextual errors")
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="ISO 8601 UTC timestamp of the error",
    )
