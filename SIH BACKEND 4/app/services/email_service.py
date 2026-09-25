from datetime import datetime, timezone
from email.message import EmailMessage
import logging
import uuid
from typing import Optional
import aiosmtplib
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.models import (
    EmailNotificationLog,
    NotificationStatus,
    ActivityLog
)
from app.schemas.notification import EmailNotificationRequest, NotificationResponse

logger = logging.getLogger(__name__)


class EmailService:
    @staticmethod
    async def send_email(
        session: AsyncSession,
        request: EmailNotificationRequest
    ) -> NotificationResponse:
        now_utc = datetime.now(timezone.utc)
        message_id = f"msg_{uuid.uuid4().hex[:16]}"
        status = NotificationStatus.PENDING
        error_msg: Optional[str] = None

        # Format HTML body if not provided
        html_content = request.body_html
        if not html_content:
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                        <div style="background-color: #1e3a8a; color: #fff; padding: 16px 24px;">
                            <h2 style="margin: 0; font-size: 20px;">{settings.SMTP_FROM_NAME}</h2>
                        </div>
                        <div style="padding: 24px;">
                            <h3 style="margin-top: 0; color: #0f172a;">{request.subject}</h3>
                            <p>{request.body_text}</p>
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                            <p style="font-size: 12px; color: #64748b;">
                                This is an automated governance notification from the Societal Innovation Platform. Please do not reply directly.
                            </p>
                        </div>
                    </div>
                </body>
            </html>
            """

        # Dispatch email
        if settings.SMTP_MOCK_MODE or not settings.SMTP_USER:
            logger.info(
                f"[SMTP MOCK DISPATCH] To: {request.recipient_email} | Subject: {request.subject} | ID: {message_id}"
            )
            status = NotificationStatus.SENT
        else:
            try:
                msg = EmailMessage()
                msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
                msg["To"] = f"{request.recipient_name} <{request.recipient_email}>" if request.recipient_name else request.recipient_email
                msg["Subject"] = request.subject
                msg.set_content(request.body_text)
                msg.add_alternative(html_content, subtype="html")

                await aiosmtplib.send(
                    msg,
                    hostname=settings.SMTP_HOST,
                    port=settings.SMTP_PORT,
                    username=settings.SMTP_USER,
                    password=settings.SMTP_PASSWORD,
                    start_tls=settings.SMTP_USE_TLS,
                    timeout=10.0
                )
                status = NotificationStatus.SENT
            except Exception as e:
                logger.error(f"Failed to send email to {request.recipient_email}: {e}")
                status = NotificationStatus.FAILED
                error_msg = str(e)

        # Log into database
        email_log = EmailNotificationLog(
            recipient_email=request.recipient_email,
            recipient_name=request.recipient_name or request.recipient_email,
            subject=request.subject,
            body_text=request.body_text,
            body_html=html_content,
            template_name=request.template_name,
            status=status,
            error_message=error_msg,
            message_id=message_id,
            sent_at=now_utc if status == NotificationStatus.SENT else None
        )
        session.add(email_log)

        # Audit log
        activity = ActivityLog(
            actor_id="SYSTEM-NOTIFIER",
            actor_role="SYSTEM",
            action="EMAIL_DISPATCHED" if status == NotificationStatus.SENT else "EMAIL_DISPATCH_FAILED",
            entity_type="NOTIFICATION",
            entity_id=message_id,
            description=f"Email '{request.subject}' sent to {request.recipient_email}.",
            details={"template": request.template_name, "status": status.value}
        )
        session.add(activity)
        await session.commit()
        await session.refresh(email_log)

        return NotificationResponse(
            notification_id=email_log.id,
            channel="EMAIL",
            status=status.value,
            recipient=request.recipient_email,
            delivered_at=now_utc,
            message_id=message_id
        )
