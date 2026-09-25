import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import (
    WorkflowInstanceModel,
    WorkflowHistoryModel,
    StakeholderRecommendationModel,
    CollaborationModel,
    OfficeModel,
)
from app.repositories.workflow_repository import WorkflowRepository
from app.repositories.department_repository import DepartmentRepository
from app.repositories.assignment_repository import AssignmentRepository
from app.schemas.assignment_schemas import (
    AssignOwnerRequest,
    ReassignOwnerRequest,
    GenerateRecommendationsRequest,
)
from shared.enums import (
    WorkflowStatus,
    StakeholderType,
    AssignmentRole,
    CollaborationStatus,
    IssueCategory,
    PriorityLevel,
)
from shared.exceptions import EntityNotFoundError, InvalidStateTransitionError

logger = logging.getLogger(__name__)


# Knowledge matrices for Multi-Stakeholder Recommendation Engines
ACADEMIC_DOMAIN_MATRIX: Dict[IssueCategory, List[Dict[str, Any]]] = {
    IssueCategory.ROADS_AND_TRANSPORT: [
        {"name": "National Institute of Technology - Transportation Engineering Dept", "domain": "Civil & Transportation Engg", "score": 0.94, "rationale": "High-impact opportunity for pavement distress analysis, smart traffic signaling, and student road-safety audits."},
        {"name": "State University Faculty of Civil & Infrastructure", "domain": "Smart Urban Transit", "score": 0.88, "rationale": "Eligible for final-year engineering capstone project on resilient road materials."},
    ],
    IssueCategory.WATER_AND_SANITATION: [
        {"name": "University Centre for Water Resource Management", "domain": "Hydrology & Water Quality", "score": 0.96, "rationale": "Ideal for water sample testing, pipeline sensor integration, and non-revenue water reduction research."},
        {"name": "College of Environmental Engineering", "domain": "Sanitation Systems", "score": 0.89, "rationale": "Student research group available for ground-water contamination and pipe telemetry study."},
    ],
    IssueCategory.DRAINAGE_AND_FLOOD: [
        {"name": "Geospatial & Hydro-Informatics Research Lab", "domain": "Flood Inundation Modeling", "score": 0.95, "rationale": "Can provide real-time GIS mapping, watershed modeling, and storm-drain capacity simulations."},
    ],
    IssueCategory.ELECTRICITY_AND_LIGHTING: [
        {"name": "Institute of Electrical & Renewable Energy", "domain": "Smart Grid & Solar Lighting", "score": 0.92, "rationale": "Opportunity to pilot solar LED retrofits and smart IoT metering nodes."},
    ],
    IssueCategory.PUBLIC_HEALTH_AND_SAFETY: [
        {"name": "Public Health Institute & Medical College", "domain": "Epidemiology & Community Medicine", "score": 0.93, "rationale": "Can conduct field health surveys, disease vector mapping, and citizen health impact analysis."},
    ],
    IssueCategory.ENVIRONMENT_AND_POLLUTION: [
        {"name": "School of Environmental Sciences", "domain": "Air & Soil Pollution Research", "score": 0.95, "rationale": "Equipped with mobile sensor rigs to quantify particulate matter and industrial runoff."},
    ],
    IssueCategory.EDUCATION_INFRASTRUCTURE: [
        {"name": "Department of Educational Technology & Planning", "domain": "Smart Classrooms & School Architecture", "score": 0.90, "rationale": "Can design low-cost ergonomic infrastructure and digital learning lab layouts."},
    ],
    IssueCategory.WOMEN_AND_CHILD_SAFETY: [
        {"name": "Centre for Women's Studies & Urban Sociology", "domain": "Gender-sensitive Urban Planning", "score": 0.94, "rationale": "Can audit dark spots, public transit safety indices, and pedestrian accessibility."},
    ],
}

INDUSTRY_CSR_MATRIX: Dict[IssueCategory, List[Dict[str, Any]]] = {
    IssueCategory.ROADS_AND_TRANSPORT: [
        {"name": "InfraTech Solutions Pvt Ltd", "domain": "Pavement Tech & Materials CSR", "score": 0.92, "rationale": "Offers polymer-modified bitumen road repair materials and CSR funding for accident-prone intersections."},
        {"name": "UrbanMobility Consortium", "domain": "Smart Signage CSR", "score": 0.86, "rationale": "Funds automated solar-powered traffic and pedestrian signal installation."},
    ],
    IssueCategory.WATER_AND_SANITATION: [
        {"name": "CleanWater Foundation (CSR of Global Petrochemicals)", "domain": "Safe Drinking Water CSR", "score": 0.95, "rationale": "Provides community RO plant setups and water dispenser kiosks in underserved wards."},
        {"name": "AquaPure Technologies", "domain": "Desalination & Filtration", "score": 0.89, "rationale": "Can deploy mobile ultrafiltration units for rapid potable water delivery."},
    ],
    IssueCategory.DRAINAGE_AND_FLOOD: [
        {"name": "EcoDrains Construction Corp", "domain": "Culvert & Drainage Tech", "score": 0.93, "rationale": "CSR fund for precast storm-water drain installation and silt removal heavy machinery."},
    ],
    IssueCategory.ELECTRICITY_AND_LIGHTING: [
        {"name": "Lumina Green Power CSR Trust", "domain": "Renewable Solar Streetlights", "score": 0.94, "rationale": "Full CSR sponsorship available for solar streetlight illumination in poorly lit public corridors."},
    ],
    IssueCategory.PUBLIC_HEALTH_AND_SAFETY: [
        {"name": "PharmaCare CSR Healthcare Initiative", "domain": "Mobile Health Vans", "score": 0.91, "rationale": "Sponsors free health screening camps and emergency medical supply distribution."},
    ],
    IssueCategory.ENVIRONMENT_AND_POLLUTION: [
        {"name": "GreenHorizon Waste Management Ltd", "domain": "Circular Economy & Composting", "score": 0.96, "rationale": "Sponsors decentralized organic waste composting plants and tree plantation drives."},
    ],
    IssueCategory.EDUCATION_INFRASTRUCTURE: [
        {"name": "Tech4All CSR Foundation", "domain": "Digital School Infrastructure", "score": 0.95, "rationale": "Provides STEM laboratory equipment, computers, and solar backup to government schools."},
    ],
    IssueCategory.WOMEN_AND_CHILD_SAFETY: [
        {"name": "SafeCities Telecom CSR", "domain": "Surveillance & SOS Networks", "score": 0.93, "rationale": "Sponsors AI-ready CCTV surveillance cameras and public emergency call boxes."},
    ],
}

VOLUNTEER_MATRIX: Dict[IssueCategory, List[Dict[str, Any]]] = {
    IssueCategory.ROADS_AND_TRANSPORT: [
        {"name": "National Cadet Corps (NCC) Civic Safety Cadre", "domain": "Traffic Discipline & Pedestrian Awareness", "score": 0.90, "rationale": "Can deploy 50+ cadets for road safety education and peak-hour pedestrian crossing assistance."},
    ],
    IssueCategory.WATER_AND_SANITATION: [
        {"name": "National Service Scheme (NSS) Youth Brigade", "domain": "Clean Water & Anti-Wastage Campaign", "score": 0.94, "rationale": "Available for door-to-door water conservation awareness and reporting leaking public taps."},
        {"name": "CleanCity Citizen Volunteers", "domain": "Sanitation Sanitation Drives", "score": 0.91, "rationale": "Community clean-up and segregation drives in the affected neighborhood."},
    ],
    IssueCategory.DRAINAGE_AND_FLOOD: [
        {"name": "Civil Defense Volunteer Force", "domain": "Monsoon Preparedness & Relief", "score": 0.96, "rationale": "Trained volunteers for sandbagging, clearing surface trash from storm drains, and flood evacuation assist."},
    ],
    IssueCategory.ELECTRICITY_AND_LIGHTING: [
        {"name": "Youth for Governance Volunteers", "domain": "Dark Spot Mapping", "score": 0.88, "rationale": "Night surveys to catalog broken streetlights across municipal wards."},
    ],
    IssueCategory.PUBLIC_HEALTH_AND_SAFETY: [
        {"name": "Red Cross Youth Volunteers", "domain": "First Aid & Hygiene Outreach", "score": 0.95, "rationale": "Vector control distribution (mosquito nets), sanitation awareness, and first-aid camps."},
    ],
    IssueCategory.ENVIRONMENT_AND_POLLUTION: [
        {"name": "Green Earth Volunteer Network", "domain": "Tree Planting & Lake Cleanups", "score": 0.96, "rationale": "Organizes weekend lake de-weeding and intensive urban afforestation programs."},
    ],
    IssueCategory.EDUCATION_INFRASTRUCTURE: [
        {"name": "TeachForCommunity Volunteers", "domain": "School Renovation & Mentoring", "score": 0.92, "rationale": "Volunteer painting, library cataloging, and weekend supplementary tutoring for students."},
    ],
    IssueCategory.WOMEN_AND_CHILD_SAFETY: [
        {"name": "SafeNeighborhood Women's Alliance", "domain": "Community Night Patrols & Safety Walks", "score": 0.94, "rationale": "Local community safety audits, street lighting monitoring, and youth self-defense workshops."},
    ],
}


class AssignmentEngine:
    """
    Orchestrates Government Allocation and Multi-Stakeholder Recommendation Engines:
    - Government Allocation (Primary Official Ownership)
    - University Recommendations (R&D, Capstones)
    - Industry Recommendations (CSR, Equipment, Tech Support)
    - Volunteer Recommendations (NSS, NCC, NGOs)
    """

    def __init__(self, session: AsyncSession):
        self.session = session
        self.workflow_repo = WorkflowRepository(session)
        self.dept_repo = DepartmentRepository(session)
        self.assignment_repo = AssignmentRepository(session)

    # 1. Government Allocation & Ownership
    async def assign_government_owner(self, request: AssignOwnerRequest) -> WorkflowInstanceModel:
        instance = await self.workflow_repo.get_by_issue_id(request.issue_id)
        if not instance:
            raise EntityNotFoundError("WorkflowInstance", request.issue_id)

        dept = await self.dept_repo.get_department_by_id(request.department_id)
        if not dept:
            raise EntityNotFoundError("Department", request.department_id)

        old_owner = instance.owner_id
        previous_state = instance.current_state

        # Update ownership details
        instance.assigned_department_id = dept.id
        if request.office_id:
            instance.assigned_office_id = request.office_id
            await self.dept_repo.increment_workload(request.office_id, delta=1)

        instance.owner_id = request.owner_id
        instance.owner_name = request.owner_name
        instance.owner_email = request.owner_email

        # If current state was SUBMITTED or VERIFIED, automatically advance to ASSIGNED
        if instance.current_state in [WorkflowStatus.SUBMITTED, WorkflowStatus.VERIFIED]:
            instance.previous_state = instance.current_state
            instance.current_state = WorkflowStatus.ASSIGNED

        # Record history audit
        history = WorkflowHistoryModel(
            workflow_instance_id=instance.id,
            issue_id=instance.issue_id,
            from_state=previous_state,
            to_state=instance.current_state,
            trigger="GOVERNMENT_OWNER_ASSIGNED",
            actor_id=request.assigned_by_id,
            actor_role="Administrator/RoutingEngine",
            remarks=request.remarks or f"Assigned primary government owner to {request.owner_name} ({dept.name}).",
            metadata_snapshot={
                "department_id": dept.id,
                "department_name": dept.name,
                "office_id": request.office_id,
                "previous_owner_id": old_owner,
                "new_owner_id": request.owner_id,
            },
        )
        await self.workflow_repo.add_history(history)
        return instance

    async def reassign_government_owner(self, issue_id: str, request: ReassignOwnerRequest) -> WorkflowInstanceModel:
        instance = await self.workflow_repo.get_by_issue_id(issue_id)
        if not instance:
            raise EntityNotFoundError("WorkflowInstance", issue_id)

        old_owner = instance.owner_id
        old_office = instance.assigned_office_id

        if old_office:
            await self.dept_repo.increment_workload(old_office, delta=-1)

        if request.new_department_id:
            instance.assigned_department_id = request.new_department_id
        if request.new_office_id:
            instance.assigned_office_id = request.new_office_id
            await self.dept_repo.increment_workload(request.new_office_id, delta=1)

        instance.owner_id = request.new_owner_id
        instance.owner_name = request.new_owner_name
        instance.owner_email = request.new_owner_email

        # Log history
        history = WorkflowHistoryModel(
            workflow_instance_id=instance.id,
            issue_id=instance.issue_id,
            from_state=instance.current_state,
            to_state=instance.current_state,
            trigger="GOVERNMENT_OWNER_REASSIGNED",
            actor_id=request.reassigned_by_id,
            actor_role="DepartmentOfficial",
            remarks=f"Reassigned to {request.new_owner_name}. Reason: {request.reason}",
            metadata_snapshot={
                "previous_owner": old_owner,
                "new_owner": request.new_owner_id,
                "reason": request.reason,
            },
        )
        await self.workflow_repo.add_history(history)
        return instance

    # 2. Multi-Stakeholder Recommendations
    async def generate_recommendations(
        self, request: GenerateRecommendationsRequest
    ) -> List[StakeholderRecommendationModel]:
        created_records: List[StakeholderRecommendationModel] = []
        cat = request.category

        # University matches
        univ_matches = ACADEMIC_DOMAIN_MATRIX.get(cat, ACADEMIC_DOMAIN_MATRIX[IssueCategory.ROADS_AND_TRANSPORT])
        for u in univ_matches:
            rec = StakeholderRecommendationModel(
                issue_id=request.issue_id,
                stakeholder_type=StakeholderType.UNIVERSITY,
                entity_name=u["name"],
                entity_id=f"UNIV_{abs(hash(u['name'])) % 10000}",
                match_score=u["score"],
                matching_domain=u["domain"],
                rationale=u["rationale"],
                recommended_role=AssignmentRole.ACADEMIC_RESEARCH,
                contact_email="collaborate@university.edu",
                status=CollaborationStatus.INVITED,
            )
            saved = await self.assignment_repo.create_recommendation(rec)
            created_records.append(saved)

        # Industry matches
        ind_matches = INDUSTRY_CSR_MATRIX.get(cat, INDUSTRY_CSR_MATRIX[IssueCategory.ROADS_AND_TRANSPORT])
        for ind in ind_matches:
            rec = StakeholderRecommendationModel(
                issue_id=request.issue_id,
                stakeholder_type=StakeholderType.INDUSTRY,
                entity_name=ind["name"],
                entity_id=f"IND_{abs(hash(ind['name'])) % 10000}",
                match_score=ind["score"],
                matching_domain=ind["domain"],
                rationale=ind["rationale"],
                recommended_role=AssignmentRole.INDUSTRY_CSR,
                contact_email="csr@industry.com",
                status=CollaborationStatus.INVITED,
            )
            saved = await self.assignment_repo.create_recommendation(rec)
            created_records.append(saved)

        # Volunteer matches
        vol_matches = VOLUNTEER_MATRIX.get(cat, VOLUNTEER_MATRIX[IssueCategory.ROADS_AND_TRANSPORT])
        for v in vol_matches:
            rec = StakeholderRecommendationModel(
                issue_id=request.issue_id,
                stakeholder_type=StakeholderType.VOLUNTEER,
                entity_name=v["name"],
                entity_id=f"VOL_{abs(hash(v['name'])) % 10000}",
                match_score=v["score"],
                matching_domain=v["domain"],
                rationale=v["rationale"],
                recommended_role=AssignmentRole.VOLUNTEER_SUPPORT,
                contact_email="volunteers@civicnetwork.org",
                status=CollaborationStatus.INVITED,
            )
            saved = await self.assignment_repo.create_recommendation(rec)
            created_records.append(saved)

        return created_records
