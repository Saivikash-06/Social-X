"""Department and Stakeholder mapping constants."""

from backend.shared.enums.civic import (
    IssueCategory,
    ResponsibleDepartment,
    StakeholderRole,
)

# Default primary department mapping for each category
CATEGORY_TO_DEPARTMENT = {
    IssueCategory.ROADS_AND_TRANSPORT: ResponsibleDepartment.PUBLIC_WORKS_DEPARTMENT,
    IssueCategory.WATER_AND_SEWAGE: ResponsibleDepartment.WATER_AND_SEWERAGE_BOARD,
    IssueCategory.SOLID_WASTE_MANAGEMENT: ResponsibleDepartment.MUNICIPAL_CORPORATION,
    IssueCategory.ELECTRICITY_AND_POWER: ResponsibleDepartment.ELECTRICITY_DISTRIBUTION_COMPANY,
    IssueCategory.PUBLIC_HEALTH_AND_SANITATION: ResponsibleDepartment.PUBLIC_HEALTH_DEPARTMENT,
    IssueCategory.ENVIRONMENT_AND_GREENERY: ResponsibleDepartment.FOREST_AND_ENVIRONMENT_DEPT,
    IssueCategory.PUBLIC_SAFETY_AND_LAW: ResponsibleDepartment.POLICE_DEPARTMENT,
    IssueCategory.EDUCATION_AND_INFRASTRUCTURE: ResponsibleDepartment.EDUCATION_DEPARTMENT,
    IssueCategory.OTHER: ResponsibleDepartment.MUNICIPAL_CORPORATION,
}

# Collaborative opportunities for universities, industries, NGOs, volunteers
CATEGORY_TO_STAKEHOLDERS = {
    IssueCategory.ROADS_AND_TRANSPORT: [
        StakeholderRole.UNIVERSITY_RESEARCHER,
        StakeholderRole.STUDENT_INNOVATOR,
        StakeholderRole.INDUSTRY_CSR_PARTNER,
    ],
    IssueCategory.WATER_AND_SEWAGE: [
        StakeholderRole.UNIVERSITY_RESEARCHER,
        StakeholderRole.STUDENT_INNOVATOR,
        StakeholderRole.TECH_STARTUP,
        StakeholderRole.NGO,
    ],
    IssueCategory.SOLID_WASTE_MANAGEMENT: [
        StakeholderRole.VOLUNTEER_GROUP,
        StakeholderRole.NGO,
        StakeholderRole.TECH_STARTUP,
        StakeholderRole.INDUSTRY_CSR_PARTNER,
    ],
    IssueCategory.ELECTRICITY_AND_POWER: [
        StakeholderRole.TECH_STARTUP,
        StakeholderRole.STUDENT_INNOVATOR,
    ],
    IssueCategory.PUBLIC_HEALTH_AND_SANITATION: [
        StakeholderRole.VOLUNTEER_GROUP,
        StakeholderRole.NGO,
        StakeholderRole.UNIVERSITY_RESEARCHER,
    ],
    IssueCategory.ENVIRONMENT_AND_GREENERY: [
        StakeholderRole.VOLUNTEER_GROUP,
        StakeholderRole.NGO,
        StakeholderRole.INDUSTRY_CSR_PARTNER,
    ],
    IssueCategory.PUBLIC_SAFETY_AND_LAW: [
        StakeholderRole.VOLUNTEER_GROUP,
        StakeholderRole.NGO,
    ],
    IssueCategory.EDUCATION_AND_INFRASTRUCTURE: [
        StakeholderRole.INDUSTRY_CSR_PARTNER,
        StakeholderRole.VOLUNTEER_GROUP,
        StakeholderRole.STUDENT_INNOVATOR,
    ],
    IssueCategory.OTHER: [
        StakeholderRole.VOLUNTEER_GROUP,
        StakeholderRole.NGO,
    ],
}
