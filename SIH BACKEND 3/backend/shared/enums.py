from enum import Enum


class WorkflowStatus(str, Enum):
    """
    Standard 8-stage lifecycle for civic issue resolution in the platform.
    Submitted -> Verified -> Assigned -> Accepted -> In Progress -> Completed -> Citizen Verification -> Closed
    """
    SUBMITTED = "Submitted"
    VERIFIED = "Verified"
    ASSIGNED = "Assigned"
    ACCEPTED = "Accepted"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    CITIZEN_VERIFICATION = "Citizen Verification"
    CLOSED = "Closed"
    REJECTED = "Rejected"
    REOPENED = "Reopened"


class IssueCategory(str, Enum):
    ROADS_AND_TRANSPORT = "Roads and Transport"
    WATER_AND_SANITATION = "Water and Sanitation"
    ELECTRICITY_AND_LIGHTING = "Electricity and Lighting"
    DRAINAGE_AND_FLOOD = "Drainage and Flood"
    PUBLIC_HEALTH_AND_SAFETY = "Public Health and Safety"
    ENVIRONMENT_AND_POLLUTION = "Environment and Pollution"
    EDUCATION_INFRASTRUCTURE = "Education Infrastructure"
    WOMEN_AND_CHILD_SAFETY = "Women and Child Safety"
    MUNICIPAL_SERVICES = "Municipal Services"
    OTHER = "Other"


class PriorityLevel(str, Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"


class DepartmentType(str, Enum):
    PUBLIC_WORKS = "Public Works Department"
    MUNICIPAL_CORPORATION = "Municipal Corporation"
    WATER_SUPPLY_SEWERAGE = "Water Supply and Sewerage Board"
    ELECTRICITY_BOARD = "Electricity Board"
    HEALTH_DEPARTMENT = "Health and Family Welfare"
    TRANSPORT_DEPARTMENT = "Transport Department"
    ENVIRONMENT_POLLUTION_CONTROL = "Pollution Control Board"
    POLICE_DEPARTMENT = "Police and Law Enforcement"
    EDUCATION_DEPARTMENT = "School and Higher Education"
    DISASTER_MANAGEMENT = "Disaster Management Authority"


class StakeholderType(str, Enum):
    GOVERNMENT = "Government"
    UNIVERSITY = "University"
    INDUSTRY = "Industry"
    VOLUNTEER = "Volunteer"


class EscalationLevel(str, Enum):
    LEVEL_1 = "Level 1 - Field / Sub-Division Officer"
    LEVEL_2 = "Level 2 - District Nodal Officer"
    LEVEL_3 = "Level 3 - State Department Head"
    LEVEL_4 = "Level 4 - Ministerial / Vigilance Cell"


class CollaborationStatus(str, Enum):
    INVITED = "Invited"
    ACCEPTED = "Accepted"
    DECLINED = "Declined"
    ACTIVE = "Active"
    COMPLETED = "Completed"


class AssignmentRole(str, Enum):
    PRIMARY_OWNER = "Primary Owner"
    SECONDARY_ASSIGNEE = "Secondary Assignee"
    ACADEMIC_RESEARCH = "Academic Research Partner"
    INDUSTRY_CSR = "Industry CSR Partner"
    VOLUNTEER_SUPPORT = "Volunteer Support"
