from fastapi import APIRouter
from app.api.v1.departments import router as departments_router
from app.api.v1.routing import router as routing_router
from app.api.v1.workflow import router as workflow_router
from app.api.v1.assignment import router as assignment_router
from app.api.v1.recommendations import router as recommendations_router
from app.api.v1.collaborations import router as collaborations_router
from app.api.v1.escalations import router as escalations_router

api_router = APIRouter()

api_router.include_router(departments_router, tags=["Departments & Districts"])
api_router.include_router(routing_router, tags=["Routing Engine"])
api_router.include_router(workflow_router, tags=["Workflow Engine"])
api_router.include_router(assignment_router, tags=["Government Allocation & Ownership"])
api_router.include_router(recommendations_router, tags=["Multi-Stakeholder Recommendations"])
api_router.include_router(collaborations_router, tags=["Collaboration Management"])
api_router.include_router(escalations_router, tags=["Escalation & SLA Monitoring"])
