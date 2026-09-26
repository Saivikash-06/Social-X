import sqlite3
import json
import uuid
from datetime import datetime, timezone, timedelta

DB_PATH = "socialx_unified.db"

def seed_transparency():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    now = datetime.now(timezone.utc).isoformat()
    t_minus_2d = (datetime.now(timezone.utc) - timedelta(days=2)).isoformat()
    t_minus_5d = (datetime.now(timezone.utc) - timedelta(days=5)).isoformat()
    t_minus_7d = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    t_minus_10d = (datetime.now(timezone.utc) - timedelta(days=10)).isoformat()
    t_minus_12d = (datetime.now(timezone.utc) - timedelta(days=12)).isoformat()

    # 1. Ensure core problems exist in both variants (SOC-2026-8821 & SOC-2026-008821, SOC-2026-6402 & SOC-2026-006402)
    demo_problems = [
        (
            "SOC-2026-008821",
            "Potable Water Main Line Fracture & Flooding",
            "A primary underground water supply line has cracked at the 14th Main crossroad, causing severe loss of municipal water and traffic blockage.",
            "WATER_AND_SANITATION",
            "PIPE_BURST",
            "HIGH",
            "SEVERE",
            "IN_PROGRESS",
            "14th Main Rd, Indiranagar, Bengaluru, Karnataka 560038",
            12.9716,
            77.5946,
            "usr-cit-1",
            "Vikash (Citizen)",
            "Municipal Administration & Water Supply (MAWS)",
            "usr-gov-1",
            "Thiru S. Sivakumar, IAS",
            json.dumps(["https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80"]),
            48,
            (datetime.now(timezone.utc) + timedelta(hours=36)).isoformat(),
            t_minus_12d,
            now
        ),
        (
            "SOC-2026-006402",
            "Large Pothole Cluster & Caved-in Asphalt",
            "Deep cratered road surface causing frequent two-wheeler skids following heavy monsoon rainfall.",
            "ROADS_AND_TRANSPORT",
            "POTHOLE",
            "MEDIUM",
            "MODERATE",
            "RESOLVED",
            "Koramangala 4th Block, 80 Feet Road, Bengaluru",
            12.935,
            77.624,
            "usr-cit-2",
            "Citizen User",
            "Highways & Minor Ports (Roads)",
            "usr-gov-2",
            "Government Officer",
            json.dumps(["https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"]),
            120,
            t_minus_5d,
            t_minus_7d,
            t_minus_5d
        ),
        (
            "TN-CIVIC-9021",
            "Major High-Pressure Potable Water Main Burst & Road Cave-in",
            "A 900mm DI feeder conduit ruptured near the Anna Salai intersection, flooding the carriageway and undermining asphalt substructure.",
            "WATER_AND_SANITATION",
            "PIPE_BURST",
            "CRITICAL",
            "SEVERE",
            "IN_PROGRESS",
            "Anna Salai, Near DMS Metro, Teynampet, Chennai",
            13.0425,
            80.2514,
            "CIT-TN-88219",
            "R. Sundaramurthy (Citizen)",
            "Municipal Administration & Water Supply (MAWS)",
            "usr-gov-1",
            "Thiru S. Sivakumar, IAS",
            json.dumps(["https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80"]),
            24,
            (datetime.now(timezone.utc) + timedelta(hours=12)).isoformat(),
            t_minus_5d,
            now
        ),
        (
            "TN-CIVIC-8974",
            "Hazardous 11kV HT Power Line Snapped Over Pedestrian Footway",
            "A tree branch collapsed onto live high-tension overhead cables along South Veli Street. Cable is hanging 1.5 meters from pedestrian walkway, posing immediate electrocution hazard.",
            "ELECTRICITY_AND_LIGHTING",
            "POWER_LINE_HAZARD",
            "CRITICAL",
            "SEVERE",
            "IN_PROGRESS",
            "South Veli Street, Opposite District Hospital, Madurai",
            9.9195,
            78.1193,
            "CIT-TN-45102",
            "Meenakshi Sundaram (Citizen)",
            "Tamil Nadu Generation and Distribution Corp (TANGEDCO)",
            "usr-gov-1",
            "Er. K. Ramanathan, M.E.",
            json.dumps(["https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80"]),
            12,
            (datetime.now(timezone.utc) + timedelta(hours=6)).isoformat(),
            t_minus_2d,
            now
        ),
        (
            "SOC-2026-000130",
            "Severe Water Main Burst at Anna Salai Crossing",
            "Severe underground potable pipe burst flooding arterial road with rapid water loss.",
            "WATER_AND_SANITATION",
            "PIPE_BURST",
            "HIGH",
            "SEVERE",
            "SUBMITTED",
            "Anna Salai Junction, Chennai, Tamil Nadu",
            13.0604,
            80.2496,
            "usr-cit-1",
            "Vikash (Citizen)",
            "Municipal Administration & Water Supply (MAWS)",
            None,
            None,
            json.dumps([]),
            48,
            (datetime.now(timezone.utc) + timedelta(hours=48)).isoformat(),
            (datetime.now(timezone.utc) - timedelta(hours=4)).isoformat(),
            now
        ),
        (
            "SOC-2026-000135",
            "Subterranean Water Main Rupture with Cavity Formation",
            "Deep sub-surface leakage undermining tarmac near university campus, creating hazardous sinkhole risk.",
            "WATER_AND_SANITATION",
            "SUBSURFACE_LEAK",
            "HIGH",
            "SEVERE",
            "IN_PROGRESS",
            "Sardar Patel Road, Near Anna University Gate, Chennai",
            13.0102,
            80.2355,
            "usr-cit-1",
            "Vikash (Citizen)",
            "Municipal Administration & Water Supply (MAWS)",
            "usr-gov-1",
            "Thiru S. Sivakumar, IAS",
            json.dumps(["https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"]),
            72,
            (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat(),
            t_minus_5d,
            now
        )
    ]

    for p in demo_problems:
        exists = c.execute("SELECT id FROM problems WHERE id = ?", (p[0],)).fetchone()
        if not exists:
            c.execute(
                """INSERT INTO problems (id, title, description, category, sub_category, priority, severity, status,
                   address, latitude, longitude, citizen_id, citizen_name, assigned_department, assigned_officer_id,
                   assigned_officer_name, evidence_urls, sla_hours, sla_due_at, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                p
            )
            c.execute(
                """INSERT OR IGNORE INTO workflows (id, issue_id, current_state, priority, category, assigned_department_id,
                   sla_hours, sla_due_at, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (str(uuid.uuid4()), p[0], p[7], p[5], p[3], p[13], p[17], p[18], p[19], p[20])
            )

    conn.commit()
    print("Problems seeded successfully.")

    # 2. Seed Stakeholder Handoffs
    c.execute("DELETE FROM stakeholder_handoffs")
    handoffs = [
        # SOC-2026-8821 & SOC-2026-008821
        ("sh-8821-1", "SOC-2026-008821", "Citizen Portal", "CITIZEN", "Municipal Administration & Water Supply (MAWS)", "GOVERNMENT", "MAWS - High Pressure Operations", "2026-09-14 09:30:00", "ACCEPTED", "2026-09-14 10:15:00", None, "Thiru S. Sivakumar, IAS", "Superintending Engineer", "Underground Hydraulic Distribution & Pipe Fatigue", "COLLABORATIVE", "IN_PROGRESS", 75, "Field teams mobilized de-watering pumps and replacement 900mm DI sleeve.", t_minus_12d, now),
        ("sh-8821-2", "SOC-2026-008821", "MAWS Field Operations", "GOVERNMENT", "Indian Institute of Science (IISc)", "UNIVERSITY", "Department of Civil & Environmental Engineering", "2026-09-15 08:30:00", "ACCEPTED", "2026-09-15 09:15:00", None, "Dr. K. S. Balasubramanian", "Lead Faculty Mentor & R&D Chair", "Acoustic Telemetry & Micro-seismic Sensor IoT", "COLLABORATIVE", "FIELD_VALIDATION", 80, "IoT vibration clamp sensors attached to bypass valves; telemetry feed active.", t_minus_10d, now),
        ("sh-8821-3", "SOC-2026-008821", "MAWS Technical Sanction Cell", "GOVERNMENT", "L&T Hydro-Tech Infrastructure", "INDUSTRY", "Urban Pipeline Engineering Division", "2026-09-15 11:00:00", "ACCEPTED", "2026-09-15 12:30:00", None, "Er. Rajesh Varma", "Senior Project Director", "Heavy Excavation & High-Pressure Hydraulic Splicing", "COLLABORATIVE", "IN_PROGRESS", 70, "Trenching completed; welding of ductile iron flange joints underway.", t_minus_10d, now),

        ("sh-8821-1b", "SOC-2026-8821", "Citizen Portal", "CITIZEN", "Municipal Administration & Water Supply (MAWS)", "GOVERNMENT", "MAWS - High Pressure Operations", "2026-09-14 09:30:00", "ACCEPTED", "2026-09-14 10:15:00", None, "Thiru S. Sivakumar, IAS", "Superintending Engineer", "Underground Hydraulic Distribution & Pipe Fatigue", "COLLABORATIVE", "IN_PROGRESS", 75, "Field teams mobilized de-watering pumps and replacement 900mm DI sleeve.", t_minus_12d, now),
        ("sh-8821-2b", "SOC-2026-8821", "MAWS Field Operations", "GOVERNMENT", "Indian Institute of Science (IISc)", "UNIVERSITY", "Department of Civil & Environmental Engineering", "2026-09-15 08:30:00", "ACCEPTED", "2026-09-15 09:15:00", None, "Dr. K. S. Balasubramanian", "Lead Faculty Mentor & R&D Chair", "Acoustic Telemetry & Micro-seismic Sensor IoT", "COLLABORATIVE", "FIELD_VALIDATION", 80, "IoT vibration clamp sensors attached to bypass valves; telemetry feed active.", t_minus_10d, now),
        ("sh-8821-3b", "SOC-2026-8821", "MAWS Technical Sanction Cell", "GOVERNMENT", "L&T Hydro-Tech Infrastructure", "INDUSTRY", "Urban Pipeline Engineering Division", "2026-09-15 11:00:00", "ACCEPTED", "2026-09-15 12:30:00", None, "Er. Rajesh Varma", "Senior Project Director", "Heavy Excavation & High-Pressure Hydraulic Splicing", "COLLABORATIVE", "IN_PROGRESS", 70, "Trenching completed; welding of ductile iron flange joints underway.", t_minus_10d, now),

        # SOC-2026-6402 & SOC-2026-006402 (Includes a rejected handoff with reason, then accepted by next org!)
        ("sh-6402-1", "SOC-2026-006402", "Citizen Portal", "CITIZEN", "Greater Chennai Corporation (Storm Water Drainage)", "GOVERNMENT", "SWD Zone Maintenance", "2026-09-18 14:15:00", "REJECTED", "2026-09-18 15:00:00", "Jurisdiction Exception: Roadway is classified as an Arterial State Highway, outside SWD municipal purview.", None, None, None, "INDEPENDENT", "REJECTED", 0, "Forwarded to Highways & Minor Ports Department for direct execution.", t_minus_7d, t_minus_7d),
        ("sh-6402-2", "SOC-2026-006402", "GCC Central Dispatch", "GOVERNMENT", "Highways & Minor Ports (Roads)", "GOVERNMENT", "State Highway Division - Urban Roads", "2026-09-18 15:30:00", "ACCEPTED", "2026-09-18 16:00:00", None, "Er. S. Anbarasan", "Executive Engineer", "Bituminous Pavement Design & Asphalt Rheology", "INDEPENDENT", "COMPLETED", 100, "Hot-mix asphalt patch laid and vibratory rolled. Tested for density and open to traffic.", t_minus_7d, t_minus_5d),

        ("sh-6402-1b", "SOC-2026-6402", "Citizen Portal", "CITIZEN", "Greater Chennai Corporation (Storm Water Drainage)", "GOVERNMENT", "SWD Zone Maintenance", "2026-09-18 14:15:00", "REJECTED", "2026-09-18 15:00:00", "Jurisdiction Exception: Roadway is classified as an Arterial State Highway, outside SWD municipal purview.", None, None, None, "INDEPENDENT", "REJECTED", 0, "Forwarded to Highways & Minor Ports Department for direct execution.", t_minus_7d, t_minus_7d),
        ("sh-6402-2b", "SOC-2026-6402", "GCC Central Dispatch", "GOVERNMENT", "Highways & Minor Ports (Roads)", "GOVERNMENT", "State Highway Division - Urban Roads", "2026-09-18 15:30:00", "ACCEPTED", "2026-09-18 16:00:00", None, "Er. S. Anbarasan", "Executive Engineer", "Bituminous Pavement Design & Asphalt Rheology", "INDEPENDENT", "COMPLETED", 100, "Hot-mix asphalt patch laid and vibratory rolled. Tested for density and open to traffic.", t_minus_7d, t_minus_5d),

        # SOC-2026-000130 (Awaiting acceptance)
        ("sh-130-1", "SOC-2026-000130", "Citizen Portal", "CITIZEN", "Municipal Administration & Water Supply (MAWS)", "GOVERNMENT", "Central Engineering Secretariat", "2026-09-25 11:30:00", "PENDING_REVIEW", None, None, "Assigned to Zone Engineer (Pending Confirmation)", "Executive Engineer", "Hydraulic Networks", "INDEPENDENT", "ASSIGNED", 0, "Awaiting departmental workload allocation and emergency review.", now, now),

        # SOC-2026-000135 (University collaboration)
        ("sh-135-1", "SOC-2026-000135", "Citizen Portal", "CITIZEN", "Anna University (College of Engineering Guindy)", "UNIVERSITY", "Department of Electronics & Communication Engineering", "2026-09-21 09:30:00", "ACCEPTED", "2026-09-21 11:00:00", None, "Dr. R. Kumar (Faculty Mentor)", "Professor & Head", "Ultrasonic Subsurface Imaging & IoT Embeds", "COLLABORATIVE", "IN_PROGRESS", 60, "Student team deployed ultrasonic crawler rig in pilot test conduit.", t_minus_5d, now),
    ]
    for h in handoffs:
        c.execute("""INSERT INTO stakeholder_handoffs
                     (id, issue_id, from_entity_name, from_entity_type, to_entity_name, to_entity_type,
                      to_department, received_at, decision, decision_at, rejection_reason,
                      assigned_officer_name, assigned_officer_role, expert_domain,
                      collaboration_mode, work_status, current_progress_pct, progress_notes,
                      created_at, updated_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", h)

    # 3. Seed Government Monitoring Logs
    c.execute("DELETE FROM government_monitoring_logs")
    monitoring = [
        # SOC-2026-008821 & SOC-2026-8821
        ("mon-8821-1", "SOC-2026-008821", "2026-09-16 11:30:00", "Thiru S. Sivakumar, IAS", "Superintending Engineer & District Monitor", "Municipal Administration & Water Supply", "SATISFACTORY_PROGRESS", "On-site inspection completed. Trench excavation reached 2.4m depth. De-watering pumps running smoothly with zero slurry overflow to storm drains. IISc acoustic nodes clamped to distribution valves.", "Localized vehicular slowdown on 14th Main due to heavy pump footprint.", "Coordinated with Traffic Police Wardens for single-lane controlled transit and evening asphalt curing.", "RECTIFIED", "2026-09-20 10:00:00", t_minus_10d),
        ("mon-8821-2", "SOC-2026-008821", "2026-09-20 10:15:00", "Dr. M. Soundararajan", "Chief Quality Assurance Officer", "Public Works Vigilance Cell", "QUALITY_AUDIT_PASSED", "Hydrostatic test conducted at 8.5 bar for 120 minutes. Zero drop in pressure registered. New 900mm ductile iron sleeve successfully bonded with polyurethane seal.", "Residual gravel on sidewalk near pedestrian crossing.", "High-pressure washer cleaning ordered before citizen pedestrian reopening.", "IN_PROGRESS", "2026-09-28 11:00:00", t_minus_5d),

        ("mon-8821-1b", "SOC-2026-8821", "2026-09-16 11:30:00", "Thiru S. Sivakumar, IAS", "Superintending Engineer & District Monitor", "Municipal Administration & Water Supply", "SATISFACTORY_PROGRESS", "On-site inspection completed. Trench excavation reached 2.4m depth. De-watering pumps running smoothly with zero slurry overflow to storm drains. IISc acoustic nodes clamped to distribution valves.", "Localized vehicular slowdown on 14th Main due to heavy pump footprint.", "Coordinated with Traffic Police Wardens for single-lane controlled transit and evening asphalt curing.", "RECTIFIED", "2026-09-20 10:00:00", t_minus_10d),
        ("mon-8821-2b", "SOC-2026-8821", "2026-09-20 10:15:00", "Dr. M. Soundararajan", "Chief Quality Assurance Officer", "Public Works Vigilance Cell", "QUALITY_AUDIT_PASSED", "Hydrostatic test conducted at 8.5 bar for 120 minutes. Zero drop in pressure registered. New 900mm ductile iron sleeve successfully bonded with polyurethane seal.", "Residual gravel on sidewalk near pedestrian crossing.", "High-pressure washer cleaning ordered before citizen pedestrian reopening.", "IN_PROGRESS", "2026-09-28 11:00:00", t_minus_5d),

        # SOC-2026-006402 & SOC-2026-6402
        ("mon-6402-1", "SOC-2026-006402", "2026-09-19 16:30:00", "Er. V. Kannan", "Divisional Quality Assurance Engineer", "Highways & Minor Ports (Roads)", "VERIFIED_COMPLETED", "Final inspection of 80 Feet Road pothole patch. Core sample extracted showed 98.4% compaction density adhering to IRC:SP:84 specifications. Edge transitions seamless.", "None noted.", "None. Case marked for citizen verification.", "RECTIFIED", None, t_minus_5d),
        ("mon-6402-1b", "SOC-2026-6402", "2026-09-19 16:30:00", "Er. V. Kannan", "Divisional Quality Assurance Engineer", "Highways & Minor Ports (Roads)", "VERIFIED_COMPLETED", "Final inspection of 80 Feet Road pothole patch. Core sample extracted showed 98.4% compaction density adhering to IRC:SP:84 specifications. Edge transitions seamless.", "None noted.", "None. Case marked for citizen verification.", "RECTIFIED", None, t_minus_5d),

        # TN-CIVIC-9021
        ("mon-9021-1", "TN-CIVIC-9021", "2026-09-23 14:00:00", "Thiru S. Sivakumar, IAS", "Monitoring Lead & Regional Controller", "Municipal Administration & Water Supply", "IN_PROGRESS_MONITORED", "Metro-adjacent crater secured with safety barricades. Geo-membrane installed to prevent soil liquefaction under metro pillars.", "Slight water seepage from unmapped auxiliary telecom duct.", "Telecom liaison notified to seal auxiliary conduit.", "IN_PROGRESS", "2026-09-27 10:00:00", t_minus_2d),
    ]
    for m in monitoring:
        c.execute("""INSERT INTO government_monitoring_logs
                     (id, issue_id, monitored_at, officer_name, officer_designation, officer_department,
                      monitoring_status, observations, issues_identified, corrective_actions_requested,
                      corrective_action_status, next_scheduled_monitoring_date, created_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", m)

    # 4. Seed Financial Budgets
    c.execute("DELETE FROM financial_budgets")
    budgets = [
        ("bdg-8821", "SOC-2026-008821", 650000.0, 625000.0, 625000.0, 480000.0, 412500.0, "State Municipal Emergency Asset Repair & Contingency Grant", "Municipal Administration & Water Supply (MAWS)", "2026-09-14 14:00:00", "2026-09-15 16:30:00", "Approved +INR 75,000 reallocation for university IoT acoustic telemetry sensors & expedited night-shift excavation.", "INR"),
        ("bdg-8821b", "SOC-2026-8821", 650000.0, 625000.0, 625000.0, 480000.0, 412500.0, "State Municipal Emergency Asset Repair & Contingency Grant", "Municipal Administration & Water Supply (MAWS)", "2026-09-14 14:00:00", "2026-09-15 16:30:00", "Approved +INR 75,000 reallocation for university IoT acoustic telemetry sensors & expedited night-shift excavation.", "INR"),
        ("bdg-6402", "SOC-2026-006402", 145000.0, 135000.0, 135000.0, 135000.0, 128400.0, "Urban Arterial Roads Maintenance Fund 2026", "Highways & Minor Ports Department", "2026-09-18 16:30:00", None, "Full allocation disbursed for rapid hot-mix bitumen remediation.", "INR"),
        ("bdg-6402b", "SOC-2026-6402", 145000.0, 135000.0, 135000.0, 135000.0, 128400.0, "Urban Arterial Roads Maintenance Fund 2026", "Highways & Minor Ports Department", "2026-09-18 16:30:00", None, "Full allocation disbursed for rapid hot-mix bitumen remediation.", "INR"),
        ("bdg-9021", "TN-CIVIC-9021", 1200000.0, 1150000.0, 1150000.0, 850000.0, 620000.0, "Metro Corridor Infrastructure Protection Pool", "Greater Chennai Development Authority", "2026-09-22 08:30:00", None, "Critical infrastructure protection budget sanctioned under Disaster Management provisions.", "INR"),
        ("bdg-135", "SOC-2026-000135", 800000.0, 750000.0, 750000.0, 550000.0, 320000.0, "Smart Cities Mission Innovation & University R&D Grant", "Ministry of Housing & Urban Affairs", "2026-09-21 10:00:00", None, "Earmarked for university-led prototype deployment & municipal pipeline crawler.", "INR"),
    ]
    for b in budgets:
        c.execute("""INSERT INTO financial_budgets
                     (id, issue_id, estimated_cost, approved_budget, allocated_budget, committed_amount,
                      spent_amount, funding_source, funding_organization, allocated_at, last_revision_at,
                      revision_notes, currency)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", b)

    # 5. Seed Financial Expenditures (Itemized with vouchers & evidence)
    c.execute("DELETE FROM financial_expenditures")
    expenditures = [
        # SOC-2026-008821 & SOC-2026-8821
        ("exp-8821-1", "SOC-2026-008821", "bdg-8821", "900mm K9 Grade Ductile Iron Spigot-Socket Pipe & Neoprene Gaskets", "MATERIALS", 185000.0, "2026-09-15 14:20:00", "MAWS Central Procurement", "VCH-MAWS-2026-9041", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800", "Thiru S. Sivakumar, IAS", t_minus_10d),
        ("exp-8821-2", "SOC-2026-008821", "bdg-8821", "Hydraulic Trench Excavator Hire & 75HP Dewatering Submersible Pump", "EQUIPMENT", 95000.0, "2026-09-16 09:10:00", "L&T Hydro-Tech Infrastructure", "INV-LT-78210", "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800", "Er. Ramesh K.", t_minus_10d),
        ("exp-8821-3", "SOC-2026-008821", "bdg-8821", "Acoustic Telemetry Sensor Transducers, LoRa Gateways & Edge Rig", "UNIVERSITY_RESEARCH", 58000.0, "2026-09-16 17:45:00", "IISc Bangalore R&D Cell", "IISC-GRT-4402", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", "Dr. K. S. Balasubramanian", t_minus_10d),
        ("exp-8821-4", "SOC-2026-008821", "bdg-8821", "Certified High-Pressure Pipe Welders & Night-shift Road Safety Crew", "LABOR", 74500.0, "2026-09-17 19:30:00", "MAWS Field Operations", "VCH-LAB-9912", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800", "Thiru S. Sivakumar, IAS", t_minus_7d),

        ("exp-8821-1b", "SOC-2026-8821", "bdg-8821b", "900mm K9 Grade Ductile Iron Spigot-Socket Pipe & Neoprene Gaskets", "MATERIALS", 185000.0, "2026-09-15 14:20:00", "MAWS Central Procurement", "VCH-MAWS-2026-9041", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800", "Thiru S. Sivakumar, IAS", t_minus_10d),
        ("exp-8821-2b", "SOC-2026-8821", "bdg-8821b", "Hydraulic Trench Excavator Hire & 75HP Dewatering Submersible Pump", "EQUIPMENT", 95000.0, "2026-09-16 09:10:00", "L&T Hydro-Tech Infrastructure", "INV-LT-78210", "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800", "Er. Ramesh K.", t_minus_10d),
        ("exp-8821-3b", "SOC-2026-8821", "bdg-8821b", "Acoustic Telemetry Sensor Transducers, LoRa Gateways & Edge Rig", "UNIVERSITY_RESEARCH", 58000.0, "2026-09-16 17:45:00", "IISc Bangalore R&D Cell", "IISC-GRT-4402", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", "Dr. K. S. Balasubramanian", t_minus_10d),
        ("exp-8821-4b", "SOC-2026-8821", "bdg-8821b", "Certified High-Pressure Pipe Welders & Night-shift Road Safety Crew", "LABOR", 74500.0, "2026-09-17 19:30:00", "MAWS Field Operations", "VCH-LAB-9912", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800", "Thiru S. Sivakumar, IAS", t_minus_7d),

        # SOC-2026-006402 & SOC-2026-6402
        ("exp-6402-1", "SOC-2026-006402", "bdg-6402", "VG-30 Grade Bitumen & Dense Bituminous Macadam (35 Tonnes)", "MATERIALS", 78400.0, "2026-09-19 10:00:00", "Highways Dept Stores", "TNH-MAT-2026-441", "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800", "Er. S. Anbarasan", t_minus_5d),
        ("exp-6402-2", "SOC-2026-006402", "bdg-6402", "Tandem Vibratory Roller Operation & Asphalt Compaction Squad", "EQUIPMENT", 50000.0, "2026-09-19 16:00:00", "State Highways Heavy Equipment Wing", "TNH-OPS-2026-902", "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800", "Er. S. Anbarasan", t_minus_5d),

        ("exp-6402-1b", "SOC-2026-6402", "bdg-6402b", "VG-30 Grade Bitumen & Dense Bituminous Macadam (35 Tonnes)", "MATERIALS", 78400.0, "2026-09-19 10:00:00", "Highways Dept Stores", "TNH-MAT-2026-441", "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800", "Er. S. Anbarasan", t_minus_5d),
        ("exp-6402-2b", "SOC-2026-6402", "bdg-6402b", "Tandem Vibratory Roller Operation & Asphalt Compaction Squad", "EQUIPMENT", 50000.0, "2026-09-19 16:00:00", "State Highways Heavy Equipment Wing", "TNH-OPS-2026-902", "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800", "Er. S. Anbarasan", t_minus_5d),

        # SOC-2026-000135
        ("exp-135-1", "SOC-2026-000135", "bdg-135", "Ultrasonic Transducer Array & Micro-crawler Track Chassis", "PROTOTYPING", 195000.0, "2026-09-22 14:00:00", "Anna University Incubation Cell", "AU-INV-2026-118", "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800", "Dr. R. Kumar", t_minus_5d),
        ("exp-135-2", "SOC-2026-000135", "bdg-135", "Subsurface Acoustic Radar Validation Trials & Manhole Rig", "TESTING", 125000.0, "2026-09-24 16:00:00", "Anna University Incubation Cell", "AU-INV-2026-142", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", "Dr. R. Kumar", t_minus_2d),
    ]
    for e in expenditures:
        c.execute("""INSERT INTO financial_expenditures
                     (id, issue_id, budget_id, purpose, category, amount, spent_at, responsible_org,
                      voucher_ref, evidence_url, approved_by, created_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", e)

    # 6. Seed University Solutions Showcase
    c.execute("DELETE FROM university_solutions")
    solutions = [
        (
            "usol-8821-1",
            "SOC-2026-008821",
            "Indian Institute of Science (IISc), Bangalore",
            "Department of Civil & Environmental Engineering",
            "Dr. K. S. Balasubramanian, Ph.D. (Water Resources & Smart Infrastructure)",
            "AcousticPipeAI Student Team",
            json.dumps(["Aarav Sharma (Lead, B.Tech Civil)", "Pooja V. (M.Tech IoT Systems)", "Karthik R. (Data Science)"]),
            "Acoustic Subsurface Leak Detection & Real-time Pressure Telemetry",
            "Catastrophic 900mm water main rupture losing 120,000 liters/hr with major roadway collapse risks.",
            "Deploy non-invasive piezoelectric vibration transducers clamped to municipal valve chambers, streaming telemetry over low-power LoRaWAN to an edge machine learning anomaly classifier.",
            "Fast Fourier Transform (FFT) analysis to filter acoustic noise generated by vehicular surface traffic from the distinct high-frequency hiss of pressurized pipe micro-fissures.",
            json.dumps([
                {"milestone": "Baseline Background Acoustic Noise Profiling", "date": "2026-09-15", "status": "COMPLETED"},
                {"milestone": "Acoustic Transducer Clamp Hardware Installation", "date": "2026-09-16", "status": "COMPLETED"},
                {"milestone": "Real-time Telemetry Dashboard Integration to Municipal Control Room", "date": "2026-09-17", "status": "COMPLETED"},
                {"milestone": "Post-Repair 30-Day Subsurface Vibration Integrity Logging", "date": "2026-10-15", "status": "IN_PROGRESS"}
            ]),
            json.dumps([
                "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80"
            ]),
            "Hydrostatic pressure held at 8.5 bar; sensor detected 0 false alarms over 48 hours of heavy commercial traffic.",
            "Commended by MAWS Superintending Engineer Thiru Sivakumar for non-invasive monitoring; permanent telemetry station installed.",
            "IMPLEMENTED_SOLUTION",
            "2026-09-17",
            "Saved an estimated 450,000 liters of treated municipal water; reduced fault identification time from 18 hours to 9 minutes.",
            t_minus_10d,
            now
        ),
        (
            "usol-8821-1b",
            "SOC-2026-8821",
            "Indian Institute of Science (IISc), Bangalore",
            "Department of Civil & Environmental Engineering",
            "Dr. K. S. Balasubramanian, Ph.D. (Water Resources & Smart Infrastructure)",
            "AcousticPipeAI Student Team",
            json.dumps(["Aarav Sharma (Lead, B.Tech Civil)", "Pooja V. (M.Tech IoT Systems)", "Karthik R. (Data Science)"]),
            "Acoustic Subsurface Leak Detection & Real-time Pressure Telemetry",
            "Catastrophic 900mm water main rupture losing 120,000 liters/hr with major roadway collapse risks.",
            "Deploy non-invasive piezoelectric vibration transducers clamped to municipal valve chambers, streaming telemetry over low-power LoRaWAN to an edge machine learning anomaly classifier.",
            "Fast Fourier Transform (FFT) analysis to filter acoustic noise generated by vehicular surface traffic from the distinct high-frequency hiss of pressurized pipe micro-fissures.",
            json.dumps([
                {"milestone": "Baseline Background Acoustic Noise Profiling", "date": "2026-09-15", "status": "COMPLETED"},
                {"milestone": "Acoustic Transducer Clamp Hardware Installation", "date": "2026-09-16", "status": "COMPLETED"},
                {"milestone": "Real-time Telemetry Dashboard Integration to Municipal Control Room", "date": "2026-09-17", "status": "COMPLETED"},
                {"milestone": "Post-Repair 30-Day Subsurface Vibration Integrity Logging", "date": "2026-10-15", "status": "IN_PROGRESS"}
            ]),
            json.dumps([
                "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80"
            ]),
            "Hydrostatic pressure held at 8.5 bar; sensor detected 0 false alarms over 48 hours of heavy commercial traffic.",
            "Commended by MAWS Superintending Engineer Thiru Sivakumar for non-invasive monitoring; permanent telemetry station installed.",
            "IMPLEMENTED_SOLUTION",
            "2026-09-17",
            "Saved an estimated 450,000 liters of treated municipal water; reduced fault identification time from 18 hours to 9 minutes.",
            t_minus_10d,
            now
        ),
        (
            "usol-135-1",
            "SOC-2026-000135",
            "Anna University, Chennai",
            "Department of Electronics & Communication Engineering",
            "Dr. R. Kumar (Professor & Head, Sensor Networks Lab)",
            "HydroFlow Innovators",
            json.dumps(["Deepak N. (Team Lead)", "Swathi M. (Embedded Systems)", "Vignesh K. (Cloud Telemetry)"]),
            "Autonomous Ultrasonic Pipe Crawler & Void Tomography",
            "Concealed subterranean water leakage causing sub-asphalt erosion and sinkhole threats near educational institutions.",
            "Autonomous tracked crawler navigating inside non-operational secondary pipelines, emitting 5MHz ultrasonic pulses to compute residual wall thickness and exterior soil cavity voids.",
            "High-frequency time-of-flight (ToF) ultrasound echolocation with inertial measurement unit (IMU) dead-reckoning mapping.",
            json.dumps([
                {"milestone": "Simulated Pipe Rig Calibration", "date": "2026-09-22", "status": "COMPLETED"},
                {"milestone": "Tracked Robotic Chassis Assembly", "date": "2026-09-24", "status": "COMPLETED"},
                {"milestone": "Municipal Live Manhole Dry-Run", "date": "2026-09-29", "status": "SCHEDULED"}
            ]),
            json.dumps([
                "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80"
            ]),
            "Benchmarked in 20-meter test rig with 0.2mm precision in wall thinning identification.",
            "Municipal Water Supply department granted permission for field testing in Sector 4 feeder line.",
            "DEVELOPED_PROTOTYPE",
            None,
            "Working prototype currently undergoing municipal field calibration trials.",
            t_minus_5d,
            now
        )
    ]
    for s in solutions:
        c.execute("""INSERT INTO university_solutions
                     (id, issue_id, university_name, department_name, faculty_mentor,
                      student_team_name, student_members, technical_domain, problem_statement,
                      proposed_solution, technical_approach, research_milestones, prototype_evidence_urls,
                      testing_validation_results, stakeholder_feedback, solution_stage,
                      implementation_date, documented_impact, created_at, updated_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", s)

    # 7. Seed Project Schedules & Durations
    c.execute("DELETE FROM project_schedules")
    schedules = [
        (
            "sch-8821",
            "SOC-2026-008821",
            "2026-09-14 09:30:00",
            "2026-09-14 09:31:00",
            "2026-09-14 10:15:00",
            "2026-09-14 11:30:00",
            "2026-09-17 18:00:00",
            None,
            52.5,
            json.dumps([
                {"date": "2026-09-15", "delayHours": 6, "reason": "Heavy monsoon downpour required temporary de-watering and high-voltage line isolation for worker safety.", "recordedBy": "Thiru S. Sivakumar, IAS"}
            ]),
            json.dumps({
                "Submitted": 0.02,
                "Verified": 0.75,
                "Assigned": 1.25,
                "Accepted": 1.0,
                "In Progress": 49.5,
                "Completed": 0.0,
                "Citizen Verification": 0.0,
                "Closed": 0.0
            }),
            0,
            t_minus_12d,
            now
        ),
        (
            "sch-8821b",
            "SOC-2026-8821",
            "2026-09-14 09:30:00",
            "2026-09-14 09:31:00",
            "2026-09-14 10:15:00",
            "2026-09-14 11:30:00",
            "2026-09-17 18:00:00",
            None,
            52.5,
            json.dumps([
                {"date": "2026-09-15", "delayHours": 6, "reason": "Heavy monsoon downpour required temporary de-watering and high-voltage line isolation for worker safety.", "recordedBy": "Thiru S. Sivakumar, IAS"}
            ]),
            json.dumps({
                "Submitted": 0.02,
                "Verified": 0.75,
                "Assigned": 1.25,
                "Accepted": 1.0,
                "In Progress": 49.5,
                "Completed": 0.0,
                "Citizen Verification": 0.0,
                "Closed": 0.0
            }),
            0,
            t_minus_12d,
            now
        ),
        (
            "sch-6402",
            "SOC-2026-006402",
            "2026-09-18 14:10:00",
            "2026-09-18 14:15:00",
            "2026-09-18 16:00:00",
            "2026-09-18 17:00:00",
            "2026-09-20 17:00:00",
            "2026-09-19 17:00:00",
            26.8,
            json.dumps([]),
            json.dumps({
                "Submitted": 0.08,
                "Verified": 0.5,
                "Assigned": 1.25,
                "Accepted": 1.0,
                "In Progress": 24.0,
                "Completed": 0.5,
                "Citizen Verification": 0.5,
                "Closed": 0.0
            }),
            0,
            t_minus_7d,
            t_minus_5d
        ),
        (
            "sch-6402b",
            "SOC-2026-6402",
            "2026-09-18 14:10:00",
            "2026-09-18 14:15:00",
            "2026-09-18 16:00:00",
            "2026-09-18 17:00:00",
            "2026-09-20 17:00:00",
            "2026-09-19 17:00:00",
            26.8,
            json.dumps([]),
            json.dumps({
                "Submitted": 0.08,
                "Verified": 0.5,
                "Assigned": 1.25,
                "Accepted": 1.0,
                "In Progress": 24.0,
                "Completed": 0.5,
                "Citizen Verification": 0.5,
                "Closed": 0.0
            }),
            0,
            t_minus_7d,
            t_minus_5d
        ),
    ]
    for sc in schedules:
        c.execute("""INSERT INTO project_schedules
                     (id, issue_id, submission_date, forwarded_date, accepted_date,
                      project_start_date, expected_completion_date, actual_completion_date,
                      current_duration_hours, delays_recorded, stage_durations, reopen_count,
                      created_at, updated_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", sc)

    conn.commit()
    conn.close()
    print("All transparency tables populated successfully.")

if __name__ == "__main__":
    seed_transparency()
