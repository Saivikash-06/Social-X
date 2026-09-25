"""
Shared module for AI-Powered Societal Innovation Platform.
Shared enums, response formats, exceptions, and utility functions across microservices.
"""

from shared.enums import (
    WorkflowStatus,
    IssueCategory,
    PriorityLevel,
    DepartmentType,
    StakeholderType,
    EscalationLevel,
    CollaborationStatus,
    AssignmentRole,
)
from shared.responses import APIResponse, PaginatedResponse, APIErrorResponse
from shared.exceptions import (
    AppException,
    EntityNotFoundError,
    InvalidStateTransitionError,
    RuleConflictError,
    ValidationException,
)

__all__ = [
    "WorkflowStatus",
    "IssueCategory",
    "PriorityLevel",
    "DepartmentType",
    "StakeholderType",
    "EscalationLevel",
    "CollaborationStatus",
    "AssignmentRole",
    "APIResponse",
    "PaginatedResponse",
    "APIErrorResponse",
    "AppException",
    "EntityNotFoundError",
    "InvalidStateTransitionError",
    "RuleConflictError",
    "ValidationException",
]
