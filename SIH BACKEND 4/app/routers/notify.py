from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.response import ApiResponse, ResponseMeta
from app.schemas.notification import (
    EmailNotificationRequest,
    SystemNotificationRequest,
    NotificationResponse
)
from app.services.email_service import EmailService
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/notify", tags=["Notifications"])


@router.post(
    "/email",
    response_model=ApiResponse[NotificationResponse],
    status_code=status.HTTP_200_OK,
    summary="Dispatch Transactional & Alert Email via SMTP",
    description="""
Sends an asynchronous email notification via SMTP (with TLS/SSL support, HTML templates, and delivery logging).
Logs the message details in `EmailNotificationLog` and creates an audit entry in `ActivityLog`.
    """
)
async def send_email_notification(
    request: EmailNotificationRequest,
    session: AsyncSession = Depends(get_db)
):
    result = await EmailService.send_email(session, request)
    return ApiResponse(
        success=True,
        message=f"Email notification successfully processed for {result.recipient}",
        data=result,
        meta=ResponseMeta()
    )


@router.post(
    "/system",
    response_model=ApiResponse[NotificationResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Dispatch Targeted System Notification & Real-Time Broadcast",
    description="""
Dispatches an in-app system notification targeted by role (`ADMIN`, `GOV`, `UNIVERSITY`, `INDUSTRY`, `CITIZEN`, `ALL`) or recipient ID.
Persists the notification in `SystemNotification`, audits in `ActivityLog`, and automatically broadcasts it to connected WebSocket clients.
    """
)
async def send_system_notification(
    request: SystemNotificationRequest,
    session: AsyncSession = Depends(get_db)
):
    result = await NotificationService.dispatch_system_notification(session, request)
    return ApiResponse(
        success=True,
        message=f"System notification published to {result.recipient}",
        data=result,
        meta=ResponseMeta()
    )
