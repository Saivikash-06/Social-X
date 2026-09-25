"""Shared SLA constants based on Priority Level."""

from backend.shared.enums.civic import PriorityLevel

# Resolution SLA in hours
SLA_HOURS_MAP = {
    PriorityLevel.CRITICAL: 12,    # e.g., live wire, open manhole, toxic spill
    PriorityLevel.HIGH: 48,        # e.g., major water pipe burst, main road pothole
    PriorityLevel.MEDIUM: 120,     # e.g., uncollected waste, broken street light
    PriorityLevel.LOW: 240,        # e.g., faded sign, cosmetic park maintenance
}

# First response acknowledgment SLA in hours
FIRST_RESPONSE_SLA_HOURS = {
    PriorityLevel.CRITICAL: 1,
    PriorityLevel.HIGH: 4,
    PriorityLevel.MEDIUM: 12,
    PriorityLevel.LOW: 24,
}
