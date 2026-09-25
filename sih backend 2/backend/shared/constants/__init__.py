"""Shared constants package."""

from backend.shared.constants.sla import SLA_HOURS_MAP, FIRST_RESPONSE_SLA_HOURS
from backend.shared.constants.departments import (
    CATEGORY_TO_DEPARTMENT,
    CATEGORY_TO_STAKEHOLDERS,
)

__all__ = [
    "SLA_HOURS_MAP",
    "FIRST_RESPONSE_SLA_HOURS",
    "CATEGORY_TO_DEPARTMENT",
    "CATEGORY_TO_STAKEHOLDERS",
]
