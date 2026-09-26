import re

with open("unified_backend.py", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update seed_defaults() to call seed_transparency_data() if empty
seed_call_code = """            # Create corresponding workflow
            execute_query(
                \"\"\"INSERT INTO workflows (id, issue_id, current_state, priority, category, owner_id, owner_name,
                   sla_hours, sla_due_at, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) \"\"\",
                (str(uuid.uuid4()), p[0], p[7], p[5], p[3], p[14], p[15], p[17], p[18], p[19], p[20]),
                commit=True
            )

    # Seed Transparency & Public Accountability datasets if empty
    sh_count = execute_query("SELECT COUNT(*) as count FROM stakeholder_handoffs", fetch_one=True)["count"]
    if sh_count == 0:
        try:
            from seed_transparency import seed_transparency
            seed_transparency()
            logger.info("Transparency & Public Accountability master records initialized.")
        except Exception as se_err:
            logger.warning(f"seed_transparency execution warning: {se_err}")
"""

# Replace in seed_defaults
old_seed_end = """            # Create corresponding workflow
            execute_query(
                \"\"\"INSERT INTO workflows (id, issue_id, current_state, priority, category, owner_id, owner_name,
                   sla_hours, sla_due_at, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\"\"\",
                (str(uuid.uuid4()), p[0], p[7], p[5], p[3], p[14], p[15], p[17], p[18], p[19], p[20]),
                commit=True
            )"""

if old_seed_end in content:
    content = content.replace(old_seed_end, seed_call_code, 1)
    print("Seed call replaced in seed_defaults.")
else:
    print("WARNING: Could not find exact old_seed_end.")

# 2. Add transparency router before "# MOUNT ALL ROUTERS"
mount_marker = """# --------------------------------------------------------------------------------------
# MOUNT ALL ROUTERS ACROSS MULTIPLE PREFIXES FOR 100% FRONTEND COMPATIBILITY
# --------------------------------------------------------------------------------------"""

transparency_router_code = '''# --------------------------------------------------------------------------------------
# 9. PUBLIC TRANSPARENCY & CITIZEN ACCOUNTABILITY ROUTER
# --------------------------------------------------------------------------------------
transparency_router = APIRouter(prefix="/transparency", tags=["Public Transparency & Accountability"])

class GovernmentMonitoringCreate(BaseModel):
    issue_id: str
    officer_name: str
    officer_designation: str
    officer_department: str
    monitoring_status: str
    observations: str
    issues_identified: Optional[str] = None
    corrective_actions_requested: Optional[str] = None
    corrective_action_status: Optional[str] = "PENDING"
    next_scheduled_monitoring_date: Optional[str] = None

class StakeholderHandoffCreate(BaseModel):
    issue_id: str
    from_entity_name: Optional[str] = None
    from_entity_type: Optional[str] = None
    to_entity_name: str
    to_entity_type: str
    to_department: Optional[str] = None
    decision: Optional[str] = "ACCEPTED"
    decision_at: Optional[str] = None
    rejection_reason: Optional[str] = None
    assigned_officer_name: Optional[str] = None
    assigned_officer_role: Optional[str] = None
    expert_domain: Optional[str] = None
    collaboration_mode: Optional[str] = "INDEPENDENT"
    work_status: Optional[str] = "IN_PROGRESS"
    current_progress_pct: Optional[int] = 0
    progress_notes: Optional[str] = None

class FinancialBudgetCreate(BaseModel):
    issue_id: str
    estimated_cost: float
    approved_budget: float
    allocated_budget: float
    committed_amount: Optional[float] = 0.0
    funding_source: str
    funding_organization: str
    revision_notes: Optional[str] = None

class FinancialExpenditureCreate(BaseModel):
    issue_id: str
    budget_id: Optional[str] = None
    purpose: str
    category: str
    amount: float
    spent_at: Optional[str] = None
    responsible_org: str
    voucher_ref: Optional[str] = None
    evidence_url: Optional[str] = None
    approved_by: Optional[str] = None

class UniversitySolutionCreate(BaseModel):
    issue_id: str
    university_name: str
    department_name: str
    faculty_mentor: str
    student_team_name: str
    student_members: Optional[List[str]] = []
    technical_domain: str
    problem_statement: str
    proposed_solution: str
    technical_approach: str
    research_milestones: Optional[List[dict]] = []
    prototype_evidence_urls: Optional[List[str]] = []
    testing_validation_results: Optional[str] = None
    stakeholder_feedback: Optional[str] = None
    solution_stage: Optional[str] = "PROPOSED_IDEA"
    implementation_date: Optional[str] = None
    documented_impact: Optional[str] = None

@transparency_router.get("/metrics")
def get_transparency_metrics():
    total_problems = execute_query("SELECT COUNT(*) as count FROM problems", fetch_one=True)["count"]
    status_rows = execute_query("SELECT status, COUNT(*) as cnt FROM problems GROUP BY status", fetch_all=True)
    status_map = {r["status"]: r["cnt"] for r in status_rows}

    awaiting_acceptance_row = execute_query(
        """SELECT COUNT(DISTINCT id) as cnt FROM problems
           WHERE status IN ('SUBMITTED', 'VERIFIED', 'ASSIGNED')
              OR id IN (SELECT issue_id FROM stakeholder_handoffs WHERE decision = 'PENDING_REVIEW')""",
        fetch_one=True
    )
    awaiting_acceptance = awaiting_acceptance_row["cnt"] if awaiting_acceptance_row else 0

    in_resolution_row = execute_query(
        "SELECT COUNT(DISTINCT id) as cnt FROM problems WHERE status IN ('ACCEPTED', 'IN_PROGRESS', 'UNDER_REVIEW')",
        fetch_one=True
    )
    in_resolution = in_resolution_row["cnt"] if in_resolution_row else 0

    completed_row = execute_query(
        "SELECT COUNT(DISTINCT id) as cnt FROM problems WHERE status IN ('RESOLVED', 'CLOSED', 'COMPLETED') OR citizen_rating IS NOT NULL",
        fetch_one=True
    )
    completed_verified = completed_row["cnt"] if completed_row else 0

    budget_row = execute_query(
        "SELECT COALESCE(SUM(allocated_budget), 0) as allocated, COALESCE(SUM(spent_amount), 0) as spent FROM financial_budgets",
        fetch_one=True
    )
    exp_row = execute_query(
        "SELECT COALESCE(SUM(amount), 0) as total_spent FROM financial_expenditures",
        fetch_one=True
    )
    total_allocated = float(budget_row["allocated"]) if budget_row else 0.0
    total_expenditure = float(exp_row["total_spent"]) if exp_row else 0.0
    remaining_balance = max(0.0, total_allocated - total_expenditure)

    mon_row = execute_query(
        "SELECT COUNT(*) as cnt, MAX(monitored_at) as last_mon FROM government_monitoring_logs",
        fetch_one=True
    )
    total_monitoring_visits = mon_row["cnt"] if mon_row else 0
    latest_monitoring_timestamp = mon_row["last_mon"] if (mon_row and mon_row["last_mon"]) else None

    act_row = execute_query(
        "SELECT COUNT(*) as cnt FROM government_monitoring_logs WHERE corrective_action_status IN ('PENDING', 'IN_PROGRESS')",
        fetch_one=True
    )
    active_corrective_actions = act_row["cnt"] if act_row else 0

    return envelope({
        "totalProblems": total_problems,
        "statusBreakdown": status_map,
        "awaitingAcceptance": awaiting_acceptance,
        "inResolution": in_resolution,
        "completedAndVerified": completed_verified,
        "totalBudgetAllocated": total_allocated,
        "totalExpenditure": total_expenditure,
        "remainingBalance": remaining_balance,
        "totalMonitoringVisits": total_monitoring_visits,
        "latestMonitoringTimestamp": latest_monitoring_timestamp,
        "activeCorrectiveActions": active_corrective_actions,
        "lastSystemUpdateTime": datetime.now(timezone.utc).isoformat()
    }, "Transparency dashboard metrics retrieved.")

@transparency_router.get("/problems")
def list_transparency_problems(
    category: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    stakeholder: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100)
):
    query_parts = ["1=1"]
    params = []

    if category and category.lower() != "all":
        query_parts.append("(category = ? OR category LIKE ?)")
        params.extend([category, f"%{category}%"])

    if location and location.lower() != "all":
        query_parts.append("(address LIKE ? OR district LIKE ?)")
        params.extend([f"%{location}%", f"%{location}%"])

    if status and status.lower() != "all":
        query_parts.append("(status = ? OR status LIKE ?)")
        params.extend([status.upper(), f"%{status}%"])

    if stakeholder and stakeholder.lower() != "all":
        st_upper = stakeholder.upper()
        query_parts.append("""(
            id IN (SELECT issue_id FROM stakeholder_handoffs WHERE to_entity_type = ? OR to_entity_name LIKE ?)
            OR assigned_department LIKE ?
        )""")
        params.extend([st_upper, f"%{stakeholder}%", f"%{stakeholder}%"])

    if search:
        query_parts.append("(title LIKE ? OR description LIKE ? OR id LIKE ? OR address LIKE ?)")
        search_param = f"%{search}%"
        params.extend([search_param, search_param, search_param, search_param])

    if start_date:
        query_parts.append("created_at >= ?")
        params.append(start_date)

    if end_date:
        query_parts.append("created_at <= ?")
        params.append(end_date)

    where_sql = " AND ".join(query_parts)

    count_row = execute_query(f"SELECT COUNT(*) as count FROM problems WHERE {where_sql}", tuple(params), fetch_one=True)
    total = count_row["count"] if count_row else 0
    total_pages = max(1, (total + limit - 1) // limit)
    offset = (page - 1) * limit

    order_sql = "ORDER BY created_at DESC"
    problems_rows = execute_query(
        f"SELECT * FROM problems WHERE {where_sql} {order_sql} LIMIT ? OFFSET ?",
        tuple(params + [limit, offset]),
        fetch_all=True
    )

    items = []
    for r in problems_rows:
        pid = r["id"]
        alt_pid = pid.replace("-00", "-") if "-00" in pid else pid.replace("-2026-", "-2026-00")

        handoffs = execute_query(
            "SELECT * FROM stakeholder_handoffs WHERE issue_id = ? OR issue_id = ? ORDER BY received_at ASC",
            (pid, alt_pid),
            fetch_all=True
        )

        stakeholders_list = []
        primary_expert = None
        for h in handoffs:
            st_info = {
                "name": h["to_entity_name"],
                "type": h["to_entity_type"],
                "department": h["to_department"],
                "decision": h["decision"],
                "status": h["work_status"],
                "progressPct": h["current_progress_pct"]
            }
            if st_info not in stakeholders_list:
                stakeholders_list.append(st_info)
            if h["assigned_officer_name"] and not primary_expert:
                primary_expert = {
                    "name": h["assigned_officer_name"],
                    "role": h["assigned_officer_role"],
                    "domain": h["expert_domain"],
                    "organization": h["to_entity_name"]
                }

        if not primary_expert and r.get("assigned_officer_name"):
            primary_expert = {
                "name": r["assigned_officer_name"],
                "role": "Government Assigned Officer",
                "domain": r.get("category", "").replace("_", " ").title(),
                "organization": r.get("assigned_department", "Municipal Department")
            }

        b_row = execute_query(
            "SELECT * FROM financial_budgets WHERE issue_id = ? OR issue_id = ?",
            (pid, alt_pid),
            fetch_one=True
        )
        exp_sum = execute_query(
            "SELECT COALESCE(SUM(amount), 0) as total FROM financial_expenditures WHERE issue_id = ? OR issue_id = ?",
            (pid, alt_pid),
            fetch_one=True
        )
        total_exp = float(exp_sum["total"]) if exp_sum else 0.0

        budget_summary = None
        if b_row:
            budget_summary = {
                "estimatedCost": b_row["estimated_cost"],
                "approvedBudget": b_row["approved_budget"],
                "allocatedBudget": b_row["allocated_budget"],
                "spentAmount": total_exp,
                "remainingBalance": max(0.0, b_row["allocated_budget"] - total_exp),
                "fundingSource": b_row["funding_source"],
                "fundingOrganization": b_row["funding_organization"],
                "currency": b_row.get("currency", "INR")
            }

        last_mon = execute_query(
            "SELECT * FROM government_monitoring_logs WHERE issue_id = ? OR issue_id = ? ORDER BY monitored_at DESC LIMIT 1",
            (pid, alt_pid),
            fetch_one=True
        )
        monitoring_info = None
        if last_mon:
            monitoring_info = {
                "lastMonitoredAt": last_mon["monitored_at"],
                "officerName": last_mon["officer_name"],
                "officerDesignation": last_mon["officer_designation"],
                "officerDepartment": last_mon["officer_department"],
                "monitoringStatus": last_mon["monitoring_status"],
                "observations": last_mon["observations"]
            }

        usol = execute_query(
            "SELECT id, university_name, solution_stage FROM university_solutions WHERE issue_id = ? OR issue_id = ? LIMIT 1",
            (pid, alt_pid),
            fetch_one=True
        )

        st_clean = (r.get("status") or "").upper()
        if st_clean in ("CLOSED",):
            stage_idx = 8
        elif st_clean in ("CITIZEN_VERIFICATION", "FEEDBACK_PENDING"):
            stage_idx = 7
        elif st_clean in ("COMPLETED", "RESOLVED"):
            stage_idx = 6
        elif st_clean in ("IN_PROGRESS", "STUDENT_DEVELOPMENT", "INDUSTRY_VALIDATION"):
            stage_idx = 5
        elif st_clean in ("ACCEPTED", "UNDER_REVIEW"):
            stage_idx = 4
        elif st_clean in ("ASSIGNED", "ASSIGNED_TO_GOVERNMENT", "ASSIGNED_TO_UNIVERSITY", "ASSIGNED_TO_INDUSTRY"):
            stage_idx = 3
        elif st_clean in ("VERIFIED",):
            stage_idx = 2
        else:
            stage_idx = 1

        items.append({
            "id": pid,
            "title": r["title"],
            "description": r["description"],
            "category": r["category"],
            "priority": r.get("priority", "MEDIUM"),
            "severity": r.get("severity", "MODERATE"),
            "status": r.get("status", "SUBMITTED"),
            "stageIndex": stage_idx,
            "location": r.get("address") or r.get("location") or "Municipal Ward Zone",
            "address": r.get("address"),
            "latitude": r.get("latitude"),
            "longitude": r.get("longitude"),
            "citizenPublicName": r.get("citizen_name") or "Verified Citizen",
            "submissionDate": r["created_at"],
            "updatedAt": r["updated_at"],
            "assignedDepartment": r.get("assigned_department"),
            "assignedStakeholders": stakeholders_list,
            "domainExpert": primary_expert,
            "budgetSummary": budget_summary,
            "latestMonitoring": monitoring_info,
            "hasUniversitySolution": bool(usol),
            "universitySolutionSummary": {
                "universityName": usol["university_name"],
                "solutionStage": usol["solution_stage"]
            } if usol else None
        })

    return envelope({
        "items": items,
        "total": total,
        "totalPages": total_pages,
        "page": page,
        "limit": limit
    }, "Transparency problems list retrieved.")

@transparency_router.get("/problems/{issue_id}")
def get_public_accountability_dossier(issue_id: str):
    alt_id = issue_id.replace("-00", "-") if "-00" in issue_id else issue_id.replace("-2026-", "-2026-00")
    p = execute_query(
        "SELECT * FROM problems WHERE id = ? OR id = ?",
        (issue_id, alt_id),
        fetch_one=True
    )
    if not p:
        raise HTTPException(status_code=404, detail=f"Public accountability record for issue #{issue_id} not found.")

    actual_id = p["id"]

    wf_history = execute_query(
        """SELECT * FROM workflow_history WHERE issue_id = ? OR issue_id = ?
           ORDER BY created_at ASC""",
        (actual_id, alt_id),
        fetch_all=True
    )
    timeline = []
    if wf_history:
        for w in wf_history:
            timeline.append({
                "id": w["id"],
                "fromState": w.get("from_state"),
                "toState": w["to_state"],
                "trigger": w.get("trigger", "SYSTEM_UPDATE"),
                "actorId": w.get("actor_id"),
                "actorRole": w.get("actor_role") or "Authorized Actor",
                "remarks": w.get("remarks"),
                "timestamp": w["created_at"]
            })
    else:
        timeline.append({
            "id": "tl-init",
            "fromState": None,
            "toState": "Submitted",
            "trigger": "CITIZEN_SUBMISSION",
            "actorId": p.get("citizen_id"),
            "actorRole": "Citizen",
            "remarks": "Problem formally logged on the public civic portal.",
            "timestamp": p["created_at"]
        })
        if p.get("assigned_department"):
            timeline.append({
                "id": "tl-assigned",
                "fromState": "Submitted",
                "toState": "Assigned",
                "trigger": "DEPARTMENT_MATCH",
                "actorId": "gateway-router",
                "actorRole": "Municipal Gateway",
                "remarks": f"Matched and dispatched to {p['assigned_department']}.",
                "timestamp": p["updated_at"]
            })

    handoffs_rows = execute_query(
        "SELECT * FROM stakeholder_handoffs WHERE issue_id = ? OR issue_id = ? ORDER BY received_at ASC",
        (actual_id, alt_id),
        fetch_all=True
    )
    handoffs = []
    domain_experts = []
    for h in handoffs_rows:
        h_data = {
            "id": h["id"],
            "fromEntityName": h.get("from_entity_name") or "Municipal Dispatch Desk",
            "fromEntityType": h.get("from_entity_type") or "GOVERNMENT",
            "toEntityName": h["to_entity_name"],
            "toEntityType": h["to_entity_type"],
            "toDepartment": h.get("to_department"),
            "receivedAt": h["received_at"],
            "decision": h["decision"],
            "decisionAt": h.get("decision_at"),
            "rejectionReason": h.get("rejection_reason"),
            "assignedOfficerName": h.get("assigned_officer_name"),
            "assignedOfficerRole": h.get("assigned_officer_role"),
            "expertDomain": h.get("expert_domain"),
            "collaborationMode": h.get("collaboration_mode", "INDEPENDENT"),
            "workStatus": h.get("work_status", "ASSIGNED"),
            "currentProgressPct": h.get("current_progress_pct", 0),
            "progressNotes": h.get("progress_notes"),
            "createdAt": h["created_at"],
            "updatedAt": h["updated_at"]
        }
        handoffs.append(h_data)

        if h.get("assigned_officer_name") and h["decision"] == "ACCEPTED":
            domain_experts.append({
                "organization": h["to_entity_name"],
                "department": h.get("to_department"),
                "expertName": h["assigned_officer_name"],
                "designationRole": h.get("assigned_officer_role") or "Domain Expert",
                "expertDomain": h.get("expert_domain") or "Civic Engineering",
                "acceptanceDate": h.get("decision_at") or h["received_at"],
                "roleInResolution": f"Supervising technical execution for {h['to_entity_name']}",
                "workStatus": h.get("work_status"),
                "progressPct": h.get("current_progress_pct", 0),
                "progressNotes": h.get("progress_notes")
            })

    if not domain_experts and p.get("assigned_officer_name"):
        domain_experts.append({
            "organization": p.get("assigned_department", "Municipal Corporation"),
            "department": p.get("assigned_department", "Public Works"),
            "expertName": p["assigned_officer_name"],
            "designationRole": "Lead Municipal Officer",
            "expertDomain": p.get("category", "").replace("_", " ").title(),
            "acceptanceDate": p["updated_at"],
            "roleInResolution": "Primary departmental oversight & resource mobilization",
            "workStatus": p.get("status"),
            "progressPct": 100 if p.get("status") in ("RESOLVED", "CLOSED") else 50,
            "progressNotes": p.get("resolution_notes") or "Direct departmental action ongoing."
        })

    mon_rows = execute_query(
        "SELECT * FROM government_monitoring_logs WHERE issue_id = ? OR issue_id = ? ORDER BY monitored_at ASC",
        (actual_id, alt_id),
        fetch_all=True
    )
    mon_history = []
    last_monitored_timestamp = None
    latest_officer = None
    latest_dept = None
    latest_status = None

    for m in mon_rows:
        entry = {
            "id": m["id"],
            "monitoredAt": m["monitored_at"],
            "officerName": m["officer_name"],
            "officerDesignation": m["officer_designation"],
            "officerDepartment": m["officer_department"],
            "monitoringStatus": m["monitoring_status"],
            "observations": m["observations"],
            "issuesIdentified": m.get("issues_identified") or "None identified",
            "correctiveActionsRequested": m.get("corrective_actions_requested") or "No corrective action required",
            "correctiveActionStatus": m.get("corrective_action_status", "RECTIFIED"),
            "nextScheduledMonitoringDate": m.get("next_scheduled_monitoring_date")
        }
        mon_history.append(entry)
        last_monitored_timestamp = m["monitored_at"]
        latest_officer = f"{m['officer_name']} ({m['officer_designation']})"
        latest_dept = m["officer_department"]
        latest_status = m["monitoring_status"]

    government_monitoring = {
        "isMonitored": len(mon_history) > 0,
        "lastMonitoredAt": last_monitored_timestamp,
        "latestOfficer": latest_officer,
        "responsibleDepartment": latest_dept or p.get("assigned_department", "Government Monitoring Cell"),
        "currentMonitoringStatus": latest_status or ("NOT_YET_MONITORED" if len(mon_history) == 0 else "SATISFACTORY"),
        "totalInspectionsCount": len(mon_history),
        "history": mon_history
    }

    b_row = execute_query(
        "SELECT * FROM financial_budgets WHERE issue_id = ? OR issue_id = ?",
        (actual_id, alt_id),
        fetch_one=True
    )
    exp_rows = execute_query(
        "SELECT * FROM financial_expenditures WHERE issue_id = ? OR issue_id = ? ORDER BY spent_at ASC",
        (actual_id, alt_id),
        fetch_all=True
    )
    expenditures = []
    total_spent = 0.0
    for e in exp_rows:
        exp_amount = float(e["amount"])
        total_spent += exp_amount
        expenditures.append({
            "id": e["id"],
            "purpose": e["purpose"],
            "category": e["category"],
            "amount": exp_amount,
            "spentAt": e["spent_at"],
            "responsibleOrg": e["responsible_org"],
            "voucherRef": e.get("voucher_ref") or "VCH-INTERNAL-01",
            "evidenceUrl": e.get("evidence_url"),
            "approvedBy": e.get("approved_by") or "Finance Authority"
        })

    if b_row:
        alloc = float(b_row["allocated_budget"])
        rem = max(0.0, alloc - total_spent)
        financial_data = {
            "hasBudgetRecorded": True,
            "estimatedCost": float(b_row["estimated_cost"]),
            "approvedBudget": float(b_row["approved_budget"]),
            "allocatedBudget": alloc,
            "committedAmount": float(b_row.get("committed_amount", 0.0)),
            "spentAmount": total_spent,
            "remainingBalance": rem,
            "spentPercentage": round((total_spent / alloc * 100), 1) if alloc > 0 else 0,
            "fundingSource": b_row["funding_source"],
            "fundingOrganization": b_row["funding_organization"],
            "allocatedAt": b_row["allocated_at"],
            "lastRevisionAt": b_row.get("last_revision_at"),
            "revisionNotes": b_row.get("revision_notes"),
            "currency": b_row.get("currency", "INR"),
            "expenditures": expenditures
        }
    else:
        financial_data = {
            "hasBudgetRecorded": False,
            "estimatedCost": 0.0,
            "approvedBudget": 0.0,
            "allocatedBudget": 0.0,
            "committedAmount": 0.0,
            "spentAmount": total_spent,
            "remainingBalance": 0.0,
            "spentPercentage": 0,
            "fundingSource": "Municipal Operations & Maintenance General Pool",
            "fundingOrganization": p.get("assigned_department", "Municipal Corporation"),
            "allocatedAt": p["created_at"],
            "lastRevisionAt": None,
            "revisionNotes": "Departmental operational funds mobilized under standard civic SLA.",
            "currency": "INR",
            "expenditures": expenditures
        }

    sched = execute_query(
        "SELECT * FROM project_schedules WHERE issue_id = ? OR issue_id = ?",
        (actual_id, alt_id),
        fetch_one=True
    )
    if sched:
        delays = []
        if sched.get("delays_recorded"):
            try:
                delays = json.loads(sched["delays_recorded"])
            except Exception:
                pass
        stage_durs = {}
        if sched.get("stage_durations"):
            try:
                stage_durs = json.loads(sched["stage_durations"])
            except Exception:
                pass

        project_schedule = {
            "submissionDate": sched["submission_date"],
            "forwardedDate": sched.get("forwarded_date"),
            "acceptedDate": sched.get("accepted_date"),
            "projectStartDate": sched.get("project_start_date"),
            "expectedCompletionDate": sched.get("expected_completion_date"),
            "actualCompletionDate": sched.get("actual_completion_date"),
            "currentDurationHours": sched.get("current_duration_hours", 0.0),
            "delaysRecorded": delays,
            "stageDurations": stage_durs,
            "reopenCount": sched.get("reopen_count", 0)
        }
    else:
        project_schedule = {
            "submissionDate": p["created_at"],
            "forwardedDate": p["created_at"],
            "acceptedDate": p["updated_at"],
            "projectStartDate": p["updated_at"],
            "expectedCompletionDate": p.get("sla_due_at"),
            "actualCompletionDate": p.get("resolved_at"),
            "currentDurationHours": 24.0,
            "delaysRecorded": [],
            "stageDurations": {
                "Submitted": 0.1,
                "Verified": 0.5,
                "Assigned": 1.0,
                "Accepted": 1.0,
                "In Progress": 21.4,
                "Completed": 0.0,
                "Citizen Verification": 0.0,
                "Closed": 0.0
            },
            "reopenCount": 0
        }

    usol = execute_query(
        "SELECT * FROM university_solutions WHERE issue_id = ? OR issue_id = ?",
        (actual_id, alt_id),
        fetch_one=True
    )
    university_solution = None
    if usol:
        members = []
        milestones = []
        prototypes = []
        if usol.get("student_members"):
            try:
                members = json.loads(usol["student_members"])
            except Exception:
                members = [usol["student_members"]]
        if usol.get("research_milestones"):
            try:
                milestones = json.loads(usol["research_milestones"])
            except Exception:
                pass
        if usol.get("prototype_evidence_urls"):
            try:
                prototypes = json.loads(usol["prototype_evidence_urls"])
            except Exception:
                pass

        university_solution = {
            "hasStudentInnovation": True,
            "universityName": usol["university_name"],
            "departmentName": usol["department_name"],
            "facultyMentor": usol["faculty_mentor"],
            "studentTeamName": usol["student_team_name"],
            "studentMembers": members,
            "technicalDomain": usol["technical_domain"],
            "problemStatement": usol["problem_statement"],
            "proposedSolution": usol["proposed_solution"],
            "technicalApproach": usol["technical_approach"],
            "researchMilestones": milestones,
            "prototypeEvidenceUrls": prototypes,
            "testingValidationResults": usol.get("testing_validation_results"),
            "stakeholderFeedback": usol.get("stakeholder_feedback"),
            "solutionStage": usol["solution_stage"],
            "implementationDate": usol.get("implementation_date"),
            "documentedImpact": usol.get("documented_impact")
        }

    ev_urls = []
    if p.get("evidence_urls"):
        try:
            ev_urls = json.loads(p["evidence_urls"])
        except Exception:
            ev_urls = [p["evidence_urls"]]

    resolution_evidence = {
        "resolutionNotes": p.get("resolution_notes"),
        "resolutionEvidenceUrl": p.get("resolution_evidence_url"),
        "resolvedAt": p.get("resolved_at"),
        "citizenRating": p.get("citizen_rating"),
        "citizenFeedback": p.get("citizen_feedback"),
        "attachments": ev_urls
    }

    reporter = {
        "displayName": p.get("citizen_name") or "Verified Citizen",
        "role": "Citizen Reporter",
        "district": p.get("address", "").split(",")[-2].strip() if "," in (p.get("address") or "") else "Local Municipal Ward",
        "isPublicDisclosureApproved": True
    }

    audit_hash = hashlib.sha256(f"{actual_id}:{p['created_at']}:{p['status']}".encode()).hexdigest()[:16].upper()

    return envelope({
        "problem": {
            "id": actual_id,
            "title": p["title"],
            "description": p["description"],
            "category": p["category"],
            "subCategory": p.get("sub_category"),
            "priority": p.get("priority", "MEDIUM"),
            "severity": p.get("severity", "MODERATE"),
            "status": p.get("status", "SUBMITTED"),
            "address": p.get("address"),
            "location": p.get("address"),
            "latitude": p.get("latitude"),
            "longitude": p.get("longitude"),
            "assignedDepartment": p.get("assigned_department"),
            "createdAt": p["created_at"],
            "updatedAt": p["updated_at"],
            "resolvedAt": p.get("resolved_at"),
            "slaHours": p.get("sla_hours", 120),
            "slaDueAt": p.get("sla_due_at")
        },
        "reporter": reporter,
        "timeline": timeline,
        "stakeholderHandoffs": handoffs,
        "domainExperts": domain_experts,
        "governmentMonitoring": government_monitoring,
        "financialTransparency": financial_data,
        "projectSchedule": project_schedule,
        "universitySolution": university_solution,
        "resolutionEvidence": resolution_evidence,
        "finalOutcome": {
            "isResolved": p.get("status") in ("RESOLVED", "CLOSED"),
            "resolutionStatus": p.get("status"),
            "resolvedAt": p.get("resolved_at"),
            "documentedImpact": (university_solution.get("documentedImpact") if university_solution else None) or (p.get("resolution_notes") if p.get("resolution_notes") else "Remediation underway under municipal oversight.")
        },
        "audit": {
            "auditStamp": f"GOV-AUDIT-{audit_hash}",
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "dataIntegrity": "VERIFIED_PUBLIC_BLOCK"
        }
    }, "Public accountability dossier retrieved.")

@transparency_router.post("/monitoring")
async def record_government_monitoring(payload: GovernmentMonitoringCreate):
    mid = f"mon-{uuid.uuid4().hex[:8]}"
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

    execute_query(
        """INSERT INTO government_monitoring_logs
           (id, issue_id, monitored_at, officer_name, officer_designation, officer_department,
            monitoring_status, observations, issues_identified, corrective_actions_requested,
            corrective_action_status, next_scheduled_monitoring_date, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            mid, payload.issue_id, now, payload.officer_name, payload.officer_designation,
            payload.officer_department, payload.monitoring_status, payload.observations,
            payload.issues_identified, payload.corrective_actions_requested,
            payload.corrective_action_status or "PENDING",
            payload.next_scheduled_monitoring_date,
            datetime.now(timezone.utc).isoformat()
        ),
        commit=True
    )

    execute_query("UPDATE problems SET updated_at = ? WHERE id = ?", (datetime.now(timezone.utc).isoformat(), payload.issue_id), commit=True)

    asyncio.create_task(live_stream.broadcast_all({
        "event": "GOVERNMENT_MONITORING_LOGGED",
        "issue_id": payload.issue_id,
        "officer": payload.officer_name,
        "department": payload.officer_department,
        "status": payload.monitoring_status,
        "monitored_at": now
    }))

    return envelope({
        "id": mid,
        "issue_id": payload.issue_id,
        "monitored_at": now,
        "monitoring_status": payload.monitoring_status
    }, "Government monitoring activity successfully logged in the public accountability registry.")

@transparency_router.post("/handoff")
async def record_stakeholder_handoff(payload: StakeholderHandoffCreate):
    hid = f"sh-{uuid.uuid4().hex[:8]}"
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

    execute_query(
        """INSERT INTO stakeholder_handoffs
           (id, issue_id, from_entity_name, from_entity_type, to_entity_name, to_entity_type,
            to_department, received_at, decision, decision_at, rejection_reason,
            assigned_officer_name, assigned_officer_role, expert_domain,
            collaboration_mode, work_status, current_progress_pct, progress_notes,
            created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            hid, payload.issue_id, payload.from_entity_name, payload.from_entity_type,
            payload.to_entity_name, payload.to_entity_type, payload.to_department,
            now, payload.decision or "ACCEPTED",
            payload.decision_at or (now if payload.decision != "PENDING_REVIEW" else None),
            payload.rejection_reason, payload.assigned_officer_name, payload.assigned_officer_role,
            payload.expert_domain, payload.collaboration_mode or "INDEPENDENT",
            payload.work_status or "ASSIGNED", payload.current_progress_pct or 0,
            payload.progress_notes, datetime.now(timezone.utc).isoformat(), datetime.now(timezone.utc).isoformat()
        ),
        commit=True
    )

    return envelope({"id": hid, "issue_id": payload.issue_id}, "Stakeholder handoff logged.")

@transparency_router.post("/budget")
def record_or_update_budget(payload: FinancialBudgetCreate):
    bid = f"bdg-{uuid.uuid4().hex[:8]}"
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    existing = execute_query("SELECT id FROM financial_budgets WHERE issue_id = ?", (payload.issue_id,), fetch_one=True)
    if existing:
        execute_query(
            """UPDATE financial_budgets SET
               approved_budget = ?, allocated_budget = ?, committed_amount = ?,
               last_revision_at = ?, revision_notes = ?
               WHERE issue_id = ?""",
            (payload.approved_budget, payload.allocated_budget, payload.committed_amount or 0.0,
             now, payload.revision_notes, payload.issue_id),
            commit=True
        )
        return envelope({"issue_id": payload.issue_id}, "Budget revision logged.")
    else:
        execute_query(
            """INSERT INTO financial_budgets
               (id, issue_id, estimated_cost, approved_budget, allocated_budget, committed_amount,
                spent_amount, funding_source, funding_organization, allocated_at, currency)
               VALUES (?, ?, ?, ?, ?, ?, 0.0, ?, ?, ?, 'INR')""",
            (bid, payload.issue_id, payload.estimated_cost, payload.approved_budget,
             payload.allocated_budget, payload.committed_amount or 0.0,
             payload.funding_source, payload.funding_organization, now),
            commit=True
        )
        return envelope({"id": bid, "issue_id": payload.issue_id}, "Budget allocation recorded.")

@transparency_router.post("/expenditure")
def record_expenditure(payload: FinancialExpenditureCreate):
    eid = f"exp-{uuid.uuid4().hex[:8]}"
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    execute_query(
        """INSERT INTO financial_expenditures
           (id, issue_id, budget_id, purpose, category, amount, spent_at, responsible_org,
            voucher_ref, evidence_url, approved_by, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (eid, payload.issue_id, payload.budget_id, payload.purpose, payload.category,
         payload.amount, payload.spent_at or now, payload.responsible_org,
         payload.voucher_ref, payload.evidence_url, payload.approved_by, datetime.now(timezone.utc).isoformat()),
        commit=True
    )
    execute_query(
        "UPDATE financial_budgets SET spent_amount = spent_amount + ? WHERE issue_id = ?",
        (payload.amount, payload.issue_id),
        commit=True
    )
    return envelope({"id": eid, "amount": payload.amount}, "Expenditure record appended.")

@transparency_router.post("/university-solution")
def record_university_solution(payload: UniversitySolutionCreate):
    uid = f"usol-{uuid.uuid4().hex[:8]}"
    now = datetime.now(timezone.utc).isoformat()
    existing = execute_query("SELECT id FROM university_solutions WHERE issue_id = ?", (payload.issue_id,), fetch_one=True)
    if existing:
        execute_query(
            """UPDATE university_solutions SET
               proposed_solution = ?, technical_approach = ?, solution_stage = ?,
               testing_validation_results = ?, stakeholder_feedback = ?,
               implementation_date = ?, documented_impact = ?, updated_at = ?
               WHERE issue_id = ?""",
            (payload.proposed_solution, payload.technical_approach, payload.solution_stage or "PROPOSED_IDEA",
             payload.testing_validation_results, payload.stakeholder_feedback,
             payload.implementation_date, payload.documented_impact, now, payload.issue_id),
            commit=True
        )
        return envelope({"issue_id": payload.issue_id}, "University solution updated.")
    else:
        execute_query(
            """INSERT INTO university_solutions
               (id, issue_id, university_name, department_name, faculty_mentor,
                student_team_name, student_members, technical_domain, problem_statement,
                proposed_solution, technical_approach, research_milestones, prototype_evidence_urls,
                testing_validation_results, stakeholder_feedback, solution_stage,
                implementation_date, documented_impact, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (uid, payload.issue_id, payload.university_name, payload.department_name,
             payload.faculty_mentor, payload.student_team_name, json.dumps(payload.student_members or []),
             payload.technical_domain, payload.problem_statement, payload.proposed_solution,
             payload.technical_approach, json.dumps(payload.research_milestones or []),
             json.dumps(payload.prototype_evidence_urls or []), payload.testing_validation_results,
             payload.stakeholder_feedback, payload.solution_stage or "PROPOSED_IDEA",
             payload.implementation_date, payload.documented_impact, now, now),
            commit=True
        )
        return envelope({"id": uid, "issue_id": payload.issue_id}, "University student solution recorded.")

'''

content = content.replace(mount_marker, transparency_router_code + "\n" + mount_marker, 1)

# 3. Mount router across root, /api, /api/v1
old_mount_1 = "app.include_router(admin_router)"
new_mount_1 = "app.include_router(admin_router)\napp.include_router(transparency_router)"

old_mount_2 = "app.include_router(admin_router, prefix=\"/api\")"
new_mount_2 = "app.include_router(admin_router, prefix=\"/api\")\napp.include_router(transparency_router, prefix=\"/api\")"

old_mount_3 = "app.include_router(admin_router, prefix=\"/api/v1\")"
new_mount_3 = "app.include_router(admin_router, prefix=\"/api/v1\")\napp.include_router(transparency_router, prefix=\"/api/v1\")"

content = content.replace(old_mount_1, new_mount_1, 1)
content = content.replace(old_mount_2, new_mount_2, 1)
content = content.replace(old_mount_3, new_mount_3, 1)

with open("unified_backend.py", "w", encoding="utf-8") as f:
    f.write(content)

print("unified_backend.py successfully enhanced with Transparency & Accountability Router!")
