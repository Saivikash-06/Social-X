import asyncio
from datetime import datetime, timedelta, timezone
from sqlalchemy import select
from app.core.database import async_session_factory, init_db
from app.models import (
    District,
    Department,
    Issue,
    IssueCategory,
    IssueStatus,
    IssueSeverity,
    University,
    Industry,
    StakeholderProject,
    StakeholderContribution,
    StakeholderType,
    ProjectStatus,
    SystemNotification,
    NotificationRole,
    NotificationPriority,
    ActivityLog
)


async def seed_database():
    await init_db()

    async with async_session_factory() as session:
        # Check if already seeded
        result = await session.execute(select(District).limit(1))
        if result.scalar_one_or_none():
            print("Database is already seeded.")
            return

        print("Seeding initial governance data...")
        now = datetime.now(timezone.utc)

        # 1. Districts
        districts = [
            District(code="DIST-BLR-01", name="Bengaluru Urban", state="Karnataka", zone="South", population=9621551),
            District(code="DIST-MUM-02", name="Mumbai Suburban", state="Maharashtra", zone="West", population=9356962),
            District(code="DIST-DEL-03", name="Central Delhi", state="Delhi", zone="North", population=582320),
            District(code="DIST-HYD-04", name="Hyderabad", state="Telangana", zone="South", population=3943323),
            District(code="DIST-PUN-05", name="Pune", state="Maharashtra", zone="West", population=9429408),
            District(code="DIST-CHN-06", name="Chennai", state="Tamil Nadu", zone="South", population=7088000),
        ]
        session.add_all(districts)
        await session.flush()

        # 2. Departments
        departments = [
            Department(code="DEPT-PWD", name="Public Works & Roads Department", description="Road repairs, flyovers, potholes, pavements", contact_email="pwd@governance.org", district_id=districts[0].id, sla_hours=48),
            Department(code="DEPT-WATER", name="Jal Board & Water Supply", description="Drinking water, pipelines, shortage, water contamination", contact_email="water@governance.org", district_id=districts[0].id, sla_hours=24),
            Department(code="DEPT-ELEC", name="Power & Public Lighting Board", description="Streetlights, transformers, exposed wiring", contact_email="power@governance.org", district_id=districts[1].id, sla_hours=36),
            Department(code="DEPT-SWM", name="Solid Waste Management & Sanitation", description="Garbage accumulation, drainage, public toilets", contact_email="sanitation@governance.org", district_id=districts[2].id, sla_hours=24),
            Department(code="DEPT-ENV", name="Urban Environment & Pollution Control", description="Air pollution, illegal dumping, green cover", contact_email="environment@governance.org", district_id=districts[3].id, sla_hours=72),
            Department(code="DEPT-HEALTH", name="Public Health & Vector Control", description="Disease surveillance, clinic facilities, sanitation hazards", contact_email="health@governance.org", district_id=districts[4].id, sla_hours=48),
        ]
        session.add_all(departments)
        await session.flush()

        # 3. Universities
        universities = [
            University(code="UNIV-IISc", name="Indian Institute of Science", state="Karnataka", contact_email="collab@iisc.ac.in", research_focus="IoT Sensors & Water Quality", active_teams=8, students_enrolled=42),
            University(code="UNIV-IITB", name="IIT Bombay", state="Maharashtra", contact_email="societal-tech@iitb.ac.in", research_focus="Recycled Asphalt & Road Durability", active_teams=12, students_enrolled=65),
            University(code="UNIV-DTU", name="Delhi Technological University", state="Delhi", contact_email="projects@dtu.ac.in", research_focus="Solar Smart Grids & Energy Efficiency", active_teams=6, students_enrolled=30),
            University(code="UNIV-IITM", name="IIT Madras", state="Tamil Nadu", contact_email="innovation@iitm.ac.in", research_focus="Waste Segregation & Biomethanation", active_teams=9, students_enrolled=50),
        ]
        session.add_all(universities)
        await session.flush()

        # 4. Industries (CSR)
        industries = [
            Industry(code="IND-INFY", name="Infosys Foundation", sector="TECHNOLOGY", contact_email="csr@infosys.com", csr_budget_allocated=25000000.0, csr_budget_spent=14200000.0, active_partnerships=7),
            Industry(code="IND-TATA", name="Tata Community Initiatives Trust", sector="INFRASTRUCTURE", contact_email="csr@tata.com", csr_budget_allocated=40000000.0, csr_budget_spent=28500000.0, active_partnerships=11),
            Industry(code="IND-LT", name="Larsen & Toubro CSR Foundation", sector="CIVIL_CONSTRUCTION", contact_email="csr@lntecc.com", csr_budget_allocated=30000000.0, csr_budget_spent=19800000.0, active_partnerships=8),
            Industry(code="IND-RIL", name="Reliance Foundation", sector="ENERGY_WATER", contact_email="contact@reliancefoundation.org", csr_budget_allocated=50000000.0, csr_budget_spent=33400000.0, active_partnerships=14),
        ]
        session.add_all(industries)
        await session.flush()

        # 5. Issues (Realistic distribution across categories and statuses)
        sample_issues = [
            # PWD / Roads
            {
                "ticket_id": "TKT-2026-00101",
                "title": "Severe Pothole Cluster on Outer Ring Road Near Tech Park",
                "description": "Multiple large potholes causing 2km vehicle congestion and motorcycle skid accidents.",
                "category": IssueCategory.ROADS,
                "status": IssueStatus.RESOLVED,
                "severity": IssueSeverity.CRITICAL,
                "dept": departments[0],
                "dist": districts[0],
                "reported_offset_days": 12,
                "resolution_hours": 32.5,
                "is_sla_breached": False,
                "feedback_rating": 5,
                "feedback": "Repaired rapidly within 2 days with bitumen cold mix."
            },
            {
                "ticket_id": "TKT-2026-00102",
                "title": "Damaged Road Surface after Underground Fiber Laying",
                "description": "Trench left unpaved on 10th Main, causing severe dust and vehicle damage.",
                "category": IssueCategory.ROADS,
                "status": IssueStatus.IN_PROGRESS,
                "severity": IssueSeverity.HIGH,
                "dept": departments[0],
                "dist": districts[0],
                "reported_offset_days": 4,
                "resolution_hours": None,
                "is_sla_breached": True,
                "feedback_rating": None,
                "feedback": None
            },
            {
                "ticket_id": "TKT-2026-00103",
                "title": "Cave-in on Drainage Junction Road",
                "description": "Road sinking near storm drain, hazardous for heavy school buses.",
                "category": IssueCategory.ROADS,
                "status": IssueStatus.ASSIGNED,
                "severity": IssueSeverity.CRITICAL,
                "dept": departments[0],
                "dist": districts[4],
                "reported_offset_days": 1,
                "resolution_hours": None,
                "is_sla_breached": False,
                "feedback_rating": None,
                "feedback": None
            },
            # Water Scarcity / Pipelines
            {
                "ticket_id": "TKT-2026-00104",
                "title": "Main Pipeline Burst Flooding Colony Road",
                "description": "Clean municipal water gushing onto streets for 6 hours while 400 households face zero water supply.",
                "category": IssueCategory.WATER_SCARCITY,
                "status": IssueStatus.RESOLVED,
                "severity": IssueSeverity.CRITICAL,
                "dept": departments[1],
                "dist": districts[0],
                "reported_offset_days": 7,
                "resolution_hours": 14.0,
                "is_sla_breached": False,
                "feedback_rating": 5,
                "feedback": "Valve replaced quickly, water pressure restored."
            },
            {
                "ticket_id": "TKT-2026-00105",
                "title": "Contaminated Brownish Drinking Water in Sector 4",
                "description": "Sewage mixing suspected in distribution line; foul odor and discoloration.",
                "category": IssueCategory.WATER_SCARCITY,
                "status": IssueStatus.IN_PROGRESS,
                "severity": IssueSeverity.HIGH,
                "dept": departments[1],
                "dist": districts[1],
                "reported_offset_days": 2,
                "resolution_hours": None,
                "is_sla_breached": False,
                "feedback_rating": None,
                "feedback": None
            },
            {
                "ticket_id": "TKT-2026-00106",
                "title": "Dry Borewell and Non-functioning Community RO Plant",
                "description": "Slum community has no potable drinking water for past 5 days.",
                "category": IssueCategory.WATER_SCARCITY,
                "status": IssueStatus.ESCALATED,
                "severity": IssueSeverity.CRITICAL,
                "dept": departments[1],
                "dist": districts[3],
                "reported_offset_days": 5,
                "resolution_hours": None,
                "is_sla_breached": True,
                "feedback_rating": None,
                "feedback": None
            },
            # Power / Streetlights
            {
                "ticket_id": "TKT-2026-00107",
                "title": "Blackout of 14 Streetlights on Women's Transit Corridor",
                "description": "Entire 800m stretch completely dark, raising acute safety concerns for night commuters.",
                "category": IssueCategory.STREETLIGHTS,
                "status": IssueStatus.RESOLVED,
                "severity": IssueSeverity.HIGH,
                "dept": departments[2],
                "dist": districts[1],
                "reported_offset_days": 9,
                "resolution_hours": 21.0,
                "is_sla_breached": False,
                "feedback_rating": 4,
                "feedback": "LED fixtures installed."
            },
            {
                "ticket_id": "TKT-2026-00108",
                "title": "Hanging Live Electrical Wire Near Primary School",
                "description": "Snapped overhead cable sparking during light rain near school gates.",
                "category": IssueCategory.STREETLIGHTS,
                "status": IssueStatus.RESOLVED,
                "severity": IssueSeverity.CRITICAL,
                "dept": departments[2],
                "dist": districts[2],
                "reported_offset_days": 15,
                "resolution_hours": 4.5,
                "is_sla_breached": False,
                "feedback_rating": 5,
                "feedback": "Emergency squad isolated the wire within 4 hours."
            },
            {
                "ticket_id": "TKT-2026-00109",
                "title": "Flickering Streetlights and Faulty Timer Relay",
                "description": "Lights turning ON at noon and shutting OFF at 7 PM due to broken relay circuit.",
                "category": IssueCategory.STREETLIGHTS,
                "status": IssueStatus.ASSIGNED,
                "severity": IssueSeverity.MEDIUM,
                "dept": departments[2],
                "dist": districts[5],
                "reported_offset_days": 2,
                "resolution_hours": None,
                "is_sla_breached": False,
                "feedback_rating": None,
                "feedback": None
            },
            # Solid Waste & Sanitation
            {
                "ticket_id": "TKT-2026-00110",
                "title": "Overflowing Open Garbage Dump Near Market Entrance",
                "description": "5 tons of municipal waste decaying in open air, blocking pedestrian footpath.",
                "category": IssueCategory.SANITATION,
                "status": IssueStatus.RESOLVED,
                "severity": IssueSeverity.HIGH,
                "dept": departments[3],
                "dist": districts[2],
                "reported_offset_days": 18,
                "resolution_hours": 19.2,
                "is_sla_breached": False,
                "feedback_rating": 4,
                "feedback": "Dump cleared and warning signage erected."
            },
            {
                "ticket_id": "TKT-2026-00111",
                "title": "Blocked Monsoon Storm Drain Causing Sewage Inundation",
                "description": "Plastic bottles and silt clogging culvert, dirty runoff backflowing into homes.",
                "category": IssueCategory.DRAINAGE,
                "status": IssueStatus.IN_PROGRESS,
                "severity": IssueSeverity.CRITICAL,
                "dept": departments[3],
                "dist": districts[0],
                "reported_offset_days": 3,
                "resolution_hours": None,
                "is_sla_breached": True,
                "feedback_rating": None,
                "feedback": None
            },
            {
                "ticket_id": "TKT-2026-00112",
                "title": "Unserviced Public Bio-Toilets in Transit Hub",
                "description": "No running water and broken flush units across all 6 cubicles.",
                "category": IssueCategory.SANITATION,
                "status": IssueStatus.REPORTED,
                "severity": IssueSeverity.MEDIUM,
                "dept": departments[3],
                "dist": districts[4],
                "reported_offset_days": 1,
                "resolution_hours": None,
                "is_sla_breached": False,
                "feedback_rating": None,
                "feedback": None
            },
            # Environment & Pollution
            {
                "ticket_id": "TKT-2026-00113",
                "title": "Illegal Burning of Commercial Plastic Scrap in Vacant Plot",
                "description": "Toxic black smoke billowing into residential apartment complex every midnight.",
                "category": IssueCategory.ENVIRONMENT,
                "status": IssueStatus.RESOLVED,
                "severity": IssueSeverity.HIGH,
                "dept": departments[4],
                "dist": districts[3],
                "reported_offset_days": 25,
                "resolution_hours": 42.0,
                "is_sla_breached": False,
                "feedback_rating": 4,
                "feedback": "Pollution control board seized equipment and fined owner."
            },
            {
                "ticket_id": "TKT-2026-00114",
                "title": "Industrial Effluent Discharge into Lake Catchment",
                "description": "Untreated chemical froth covering lake surface, aquatic life dying.",
                "category": IssueCategory.ENVIRONMENT,
                "status": IssueStatus.IN_PROGRESS,
                "severity": IssueSeverity.CRITICAL,
                "dept": departments[4],
                "dist": districts[0],
                "reported_offset_days": 6,
                "resolution_hours": None,
                "is_sla_breached": False,
                "feedback_rating": None,
                "feedback": None
            },
            # Healthcare & Public Services
            {
                "ticket_id": "TKT-2026-00115",
                "title": "Dengue Mosquito Breeding in Stagnant Construction Basement",
                "description": "Over 20 fever cases reported in 500m radius, basement filled with 4 feet of stagnant water.",
                "category": IssueCategory.HEALTHCARE,
                "status": IssueStatus.RESOLVED,
                "severity": IssueSeverity.HIGH,
                "dept": departments[5],
                "dist": districts[4],
                "reported_offset_days": 14,
                "resolution_hours": 26.4,
                "is_sla_breached": False,
                "feedback_rating": 5,
                "feedback": "Pumping completed and larvicide sprayed across vicinity."
            },
            {
                "ticket_id": "TKT-2026-00116",
                "title": "Primary Health Centre Vaccine Cold Chain Failure",
                "description": "Backup diesel generator unserviceable; risk of insulin and measles vaccine spoilage.",
                "category": IssueCategory.HEALTHCARE,
                "status": IssueStatus.RESOLVED,
                "severity": IssueSeverity.CRITICAL,
                "dept": departments[5],
                "dist": districts[2],
                "reported_offset_days": 20,
                "resolution_hours": 8.0,
                "is_sla_breached": False,
                "feedback_rating": 5,
                "feedback": "New solar inverter installed as secondary backup."
            }
        ]

        created_issues = []
        for idx, item in enumerate(sample_issues):
            reported_date = now - timedelta(days=item["reported_offset_days"])
            resolved_date = reported_date + timedelta(hours=item["resolution_hours"]) if item["resolution_hours"] else None
            sla_due = reported_date + timedelta(hours=item["dept"].sla_hours)

            issue = Issue(
                ticket_id=item["ticket_id"],
                title=item["title"],
                description=item["description"],
                category=item["category"],
                status=item["status"],
                severity=item["severity"],
                department_id=item["dept"].id,
                district_id=item["dist"].id,
                citizen_id=f"CITIZEN-{(idx % 5) + 101}",
                latitude=12.9716 + (idx * 0.012),
                longitude=77.5946 + (idx * 0.009),
                address=f"Ward {(idx % 12) + 1}, {item['dist'].name}",
                reported_at=reported_date,
                acknowledged_at=reported_date + timedelta(hours=1),
                resolved_at=resolved_date,
                sla_due_at=sla_due,
                resolution_hours=item["resolution_hours"],
                is_sla_breached=item["is_sla_breached"],
                feedback_rating=item["feedback_rating"],
                citizen_feedback=item["feedback"]
            )
            session.add(issue)
            created_issues.append(issue)

        await session.flush()

        # 6. Stakeholder Projects
        projects = [
            StakeholderProject(
                project_code="PROJ-UNIV-01",
                issue_id=created_issues[1].id,
                stakeholder_type=StakeholderType.UNIVERSITY,
                stakeholder_name="IIT Bombay Urban Engineering Lab",
                stakeholder_id=universities[1].id,
                title="Rapid-Setting Bio-Bituminous Pothole Patching Field Trial",
                description="Engineering students deploying low-carbon, recycled binder for rapid road repairs within 4 hours.",
                status=ProjectStatus.IN_PROGRESS,
                students_involved=14,
                funding_committed=500000.0,
                funding_disbursed=350000.0,
                start_date=now - timedelta(days=20),
                target_completion_date=now + timedelta(days=40)
            ),
            StakeholderProject(
                project_code="PROJ-IND-02",
                issue_id=created_issues[4].id,
                stakeholder_type=StakeholderType.INDUSTRY,
                stakeholder_name="Infosys Foundation Smart Water Initiative",
                stakeholder_id=industries[0].id,
                title="IoT Ultrasonic Flow & Turbidity Sensor Network",
                description="CSR grant deploying 150 solar-powered water contamination sensors along urban mainlines.",
                status=ProjectStatus.IN_PROGRESS,
                students_involved=8,
                funding_committed=2200000.0,
                funding_disbursed=1800000.0,
                start_date=now - timedelta(days=45),
                target_completion_date=now + timedelta(days=15)
            ),
            StakeholderProject(
                project_code="PROJ-UNIV-03",
                issue_id=created_issues[10].id,
                stakeholder_type=StakeholderType.UNIVERSITY,
                stakeholder_name="IIT Madras Civil Robotics Group",
                stakeholder_id=universities[3].id,
                title="Autonomous Manhole Silt Scraper & Inspection Drone",
                description="Eliminating manual scavenging through teleoperated crawler drones in storm drains.",
                status=ProjectStatus.PROPOSED,
                students_involved=12,
                funding_committed=850000.0,
                funding_disbursed=200000.0,
                start_date=now - timedelta(days=10),
                target_completion_date=now + timedelta(days=60)
            ),
            StakeholderProject(
                project_code="PROJ-IND-04",
                issue_id=created_issues[6].id,
                stakeholder_type=StakeholderType.INDUSTRY,
                stakeholder_name="Tata Community Initiatives Trust",
                stakeholder_id=industries[1].id,
                title="Safe Transit Corridors - Smart Adaptive LED Lighting",
                description="Installing 400 smart LED lighting poles with emergency SOS call points in poorly lit transit routes.",
                status=ProjectStatus.COMPLETED,
                students_involved=6,
                funding_committed=3500000.0,
                funding_disbursed=3500000.0,
                start_date=now - timedelta(days=90),
                completion_date=now - timedelta(days=5)
            )
        ]
        session.add_all(projects)
        await session.flush()

        # 7. Stakeholder Contributions
        contributions = [
            StakeholderContribution(
                project_id=projects[0].id,
                contribution_type="TECHNICAL_PROTOTYPE",
                title="Cold-Mix Asphalt Binder Batch 1 & 2",
                description="10 metric tons of experimental recycled aggregate provided for ward testing.",
                amount_inr=150000.0,
                hours_logged=120.0
            ),
            StakeholderContribution(
                project_id=projects[1].id,
                contribution_type="FINANCIAL_GRANT",
                title="Infosys CSR Grant Phase 1 Disbursal",
                description="Hardware procurement for 150 wireless sensor nodes.",
                amount_inr=1800000.0,
                hours_logged=60.0
            ),
            StakeholderContribution(
                project_id=projects[3].id,
                contribution_type="CIVIL_DEPLOYMENT",
                title="Smart Lighting Infrastructure Handover",
                description="Turnkey installation of 400 poles and integration into municipal dashboard.",
                amount_inr=3500000.0,
                hours_logged=340.0
            )
        ]
        session.add_all(contributions)

        # 8. Notifications
        notifications = [
            SystemNotification(
                recipient_role=NotificationRole.ADMIN,
                title="High SLA Breach Rate in Ward 1 Water Distribution",
                message="4 unresolved high-severity complaints exceed 48h SLA threshold.",
                priority=NotificationPriority.URGENT,
                is_read=False,
                action_url="/dashboard/admin"
            ),
            SystemNotification(
                recipient_role=NotificationRole.GOV,
                title="New Critical Issue Assigned: PWD Road Cave-in",
                message="Ticket TKT-2026-00103 assigned to Public Works Department for immediate inspection.",
                priority=NotificationPriority.HIGH,
                is_read=False,
                action_url="/dashboard/gov"
            ),
            SystemNotification(
                recipient_role=NotificationRole.UNIVERSITY,
                title="New Societal Challenge Open for Research Proposal",
                message="Challenge on Autonomous Silt Clearance in Urban Drains open for student innovation teams.",
                priority=NotificationPriority.NORMAL,
                is_read=True,
                action_url="/dashboard/university"
            ),
            SystemNotification(
                recipient_role=NotificationRole.INDUSTRY,
                title="CSR Impact Milestone Achieved",
                message="Smart Lighting project completed in Mumbai Suburban. 400 poles deployed successfully.",
                priority=NotificationPriority.NORMAL,
                is_read=True,
                action_url="/dashboard/industry"
            ),
            SystemNotification(
                recipient_role=NotificationRole.CITIZEN,
                recipient_id="CITIZEN-101",
                title="Your Issue TKT-2026-00101 Has Been Resolved",
                message="The pothole cluster on Outer Ring Road has been repaired. Please rate our service.",
                priority=NotificationPriority.NORMAL,
                is_read=False,
                action_url="/dashboard/citizen"
            )
        ]
        session.add_all(notifications)

        # 9. Activity Logs
        activity_logs = [
            ActivityLog(
                actor_id="ADMIN-SYS",
                actor_role="ADMIN",
                action="SYSTEM_INITIALIZED",
                entity_type="SYSTEM",
                entity_id="SYS-BOOT",
                description="Analytics and Notification Service initialized and healthy.",
                details={"version": "1.0.0"}
            ),
            ActivityLog(
                actor_id="GOV-OFFICER-44",
                actor_role="GOV",
                action="ISSUE_RESOLVED",
                entity_type="ISSUE",
                entity_id="TKT-2026-00101",
                description="Ticket TKT-2026-00101 marked RESOLVED by PWD Inspector.",
                details={"resolution_hours": 32.5, "department": "DEPT-PWD"}
            ),
            ActivityLog(
                actor_id="CSR-MANAGER-12",
                actor_role="INDUSTRY",
                action="CSR_FUNDS_COMMITTED",
                entity_type="PROJECT",
                entity_id="PROJ-IND-02",
                description="Infosys Foundation committed INR 2,200,000 for Water Quality Sensors.",
                details={"amount": 2200000}
            ),
            ActivityLog(
                actor_id="UNIV-COORD-09",
                actor_role="UNIVERSITY",
                action="RESEARCH_TEAM_ASSIGNED",
                entity_type="PROJECT",
                entity_id="PROJ-UNIV-01",
                description="14 students from IIT Bombay assigned to Bio-Bituminous Road Trial.",
                details={"team_count": 14}
            )
        ]
        session.add_all(activity_logs)

        await session.commit()
        print("Database seeding completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())
