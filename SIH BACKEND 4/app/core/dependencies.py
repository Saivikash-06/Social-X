from typing import AsyncGenerator, Optional
from fastapi import Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.redis import RedisService, get_redis_service


class PaginationParams:
    def __init__(
        self,
        page: int = Query(1, ge=1, description="Page number (1-indexed)"),
        page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    ):
        self.page = page
        self.page_size = page_size
        self.offset = (page - 1) * page_size
        self.limit = page_size


# Standard dependencies re-exported
__all__ = ["get_db", "get_redis_service", "PaginationParams"]
