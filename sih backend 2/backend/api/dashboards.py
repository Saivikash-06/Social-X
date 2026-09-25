"""Role-specific dashboard endpoints with strict RBAC enforcement."""

from typing import Dict, Any, List
from fastapi import APIRouter, Depends, status
from backend.core.rbac import require_role
from backend.core.database import db_manager
from backend.models.user import UserResponse

router = APIRouter(tags=["Role Dashboards"])


@router.get(
    "/citizen/dashboard",
    status_code=status.HTTP_200_OK,
    summary="Citizen user dashboard",
)
async def get_citizen_dashboard(
    current_user: UserResponse = Depends(require_role("CITIZEN")),
) -> Dict[str, Any]:
    """Returns civic problem tracking metrics for the authenticated citizen."""
    user_problems = await db_manager.find_many("problems", {"citizen_id": current_user.id})
    active_count = sum(1 for p in user_problems if p.get("status") in ["SUBMITTED", "IN_PROGRESS"])
    resolved_count = sum(1 for p in user_problems if p.get("status") == "RESOLVED")

    return {
        "user_id": current_user.id,
        "name": current_user.name,
        "role": current_user.role,
        "statistics": {
            "total_reported": len(user_problems),
            "active_problems": active_count,
            "resolved_problems": resolved_count,
            "impact_points": resolved_count * 50 + len(user_problems) * 10,
        },
        "recent_reports": user_problems[:5],
    }


@router.get(
    "/student/dashboard",
    status_code=status.HTTP_200_OK,
    summary="Student Innovator dashboard",
)
async def get_student_dashboard(
    current_user: UserResponse = Depends(require_role("STUDENT")),
) -> Dict[str, Any]:
    """Returns project, team, and civic innovation credits for student innovators."""
    all_problems = await db_manager.find_many("problems", limit=100)
    open_problems = [p for p in all_problems if p.get("status") in ["SUBMITTED", "VERIFIED"]]

    return {
        "user_id": current_user.id,
        "name": current_user.name,
        "university": current_user.university or "Associated University",
        "role": current_user.role,
        "metrics": {
            "active_projects": 1,
            "completed_solutions": 0,
            "credits_earned": 85,
            "achievements_unlocked": 3,
            "certificate_milestone": "10 Problems Solved (Bronze)",
        },
        "discovered_civic_challenges": open_problems[:5],
    }


@router.get(
    "/faculty/dashboard",
    status_code=status.HTTP_200_OK,
    summary="University Faculty / Researcher dashboard",
)
async def get_faculty_dashboard(
    current_user: UserResponse = Depends(require_role("FACULTY")),
) -> Dict[str, Any]:
    """Returns review queue, research student teams, and academic grant metrics."""
    return {
        "user_id": current_user.id,
        "name": current_user.name,
        "department": current_user.department or "Research & Innovation",
        "university": current_user.university or "National Institute",
        "role": current_user.role,
        "metrics": {
            "mentored_teams": 3,
            "pending_student_reviews": 2,
            "problem_dna_verifications": 14,
            "approved_solution_grants_inr": 250000.0,
        },
        "pending_actions": [
            {"task": "Review Solar Pothole Repair Prototype", "deadline": "2026-09-20"},
            {"task": "Verify Smart Drainage Sensor Evidence", "deadline": "2026-09-22"},
        ],
    }


@router.get(
    "/industry/dashboard",
    status_code=status.HTTP_200_OK,
    summary="Industry CSR Partner & Tech Startup dashboard",
)
async def get_industry_dashboard(
    current_user: UserResponse = Depends(require_role("INDUSTRY")),
) -> Dict[str, Any]:
    """
    Returns private CSR investment, project ROI, and verified implementation status.
    Guarded by strict RBAC: requires INDUSTRY role.
    """
    return {
        "user_id": current_user.id,
        "company_name": current_user.company_name or "Enterprise CSR Partner",
        "role": current_user.role,
        "portfolio": {
            "funded_solutions_count": 4,
            "total_csr_allocated_inr": 1200000.0,
            "total_csr_spent_inr": 850000.0,
            "remaining_budget_inr": 350000.0,
            "estimated_social_roi_score": 8.7,
            "verified_implementations": 2,
        },
        "projects": [
            {
                "project_name": "Autonomous Civic Waste Collection",
                "status": "PILOT_STAGE",
                "government_verified": True,
                "allocated_inr": 500000.0,
            },
            {
                "project_name": "IoT Water Pressure Leakage Prevention",
                "status": "TESTING",
                "government_verified": False,
                "allocated_inr": 350000.0,
            },
        ],
    }


@router.get(
    "/government/dashboard",
    status_code=status.HTTP_200_OK,
    summary="Government Official & Department dashboard",
)
async def get_government_dashboard(
    current_user: UserResponse = Depends(require_role("GOVERNMENT")),
) -> Dict[str, Any]:
    """Returns department issue queue, SLA tracking, and implementation funding decisions."""
    dept = current_user.department or "MUNICIPAL_CORPORATION"
    dept_problems = await db_manager.find_many("problems", {"assigned_department": dept})

    critical_count = sum(1 for p in dept_problems if p.get("priority") == "CRITICAL")

    return {
        "user_id": current_user.id,
        "officer_name": current_user.name,
        "department": dept,
        "role": current_user.role,
        "operations": {
            "total_assigned_issues": len(dept_problems),
            "critical_p1_issues": critical_count,
            "in_progress": sum(1 for p in dept_problems if p.get("status") == "IN_PROGRESS"),
            "resolved_within_sla": sum(1 for p in dept_problems if p.get("status") == "RESOLVED"),
            "pending_funding_disbursements": 1,
        },
        "action_queue": dept_problems[:10],
    }


@router.get(
    "/admin/dashboard",
    status_code=status.HTTP_200_OK,
    summary="Platform Administrator governance dashboard",
)
async def get_admin_dashboard(
    current_user: UserResponse = Depends(require_role("ADMIN")),
) -> Dict[str, Any]:
    """Platform-wide system health, user analytics, and platform governance."""
    total_users = await db_manager.count("users")
    total_problems = await db_manager.count("problems")
    db_health = await db_manager.check_health()

    return {
        "admin_id": current_user.id,
        "admin_name": current_user.name,
        "role": current_user.role,
        "platform_metrics": {
            "total_registered_users": total_users,
            "total_civic_problems": total_problems,
            "system_status": "OPERATIONAL",
            "database_health": db_health,
        },
    }
