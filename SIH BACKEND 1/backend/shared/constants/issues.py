from enum import Enum

class IssueStatus(str, Enum):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"

class IssueSeverity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class IssueCategory(str, Enum):
    INFRASTRUCTURE = "INFRASTRUCTURE"
    SANITATION = "SANITATION"
    HEALTH = "HEALTH"
    EDUCATION = "EDUCATION"
    ENVIRONMENT = "ENVIRONMENT"
    OTHER = "OTHER"
