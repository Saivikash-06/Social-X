from enum import Enum

class RoleEnum(str, Enum):
    CITIZEN = "CITIZEN"
    GOVERNMENT = "GOVERNMENT"
    UNIVERSITY = "UNIVERSITY"
    INDUSTRY = "INDUSTRY"
    ADMIN = "ADMIN"
