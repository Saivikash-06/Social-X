from datetime import datetime, timezone
import json
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.redis import redis_service
from app.models import (
    SystemNotification,
    NotificationRole,
    NotificationPriority,
    ActivityLog
)
from app.schemas.notification import SystemNotificationRequest, NotificationResponse

logger = logging.getLogger(__name__)


class NotificationService:
    @staticmethod
    async def dispatch_system_notification(
        session: AsyncSession,
        request: SystemNotificationRequest
    ) -> NotificationResponse:
        now_utc = datetime.now(timezone.utc)

        # Parse role enum
        try:
            role_enum = NotificationRole[request.recipient_role.upper()]
        except KeyError:
            role_enum = NotificationRole.ALL

        # Parse priority enum
        try:
            prio_enum = NotificationPriority[request.priority.upper()]
        except KeyError:
            prio_enum = NotificationPriority.NORMAL

        # Persist notification
        sys_notif = SystemNotification(
            recipient_id=request.recipient_id,
            recipient_role=role_enum,
            title=request.title,
            message=request.message,
            priority=prio_enum,
            is_read=False,
            action_url=request.action_url,
            data_payload=request.data_payload
        )
        session.add(sys_notif)

        # Audit log
        activity = ActivityLog(
            actor_id="SYSTEM-NOTIFIER",
            actor_role="SYSTEM",
            action="SYSTEM_NOTIFICATION_CREATED",
            entity_type="NOTIFICATION",
            entity_id=str(request.recipient_role),
            description=f"System notification: '{request.title}' targeted at role '{role_enum.value}'",
            details={
                "priority": prio_enum.value,
                "recipient_id": request.recipient_id,
                "action_url": request.action_url
            }
        )
        session.add(activity)
        await session.commit()
        await session.refresh(sys_notif)

        # Broadcast via Redis Pub/Sub for real-time WebSocket distribution
        event_payload = {
            "event": "SYSTEM_NOTIFICATION",
            "data": {
                "id": sys_notif.id,
                "recipient_id": sys_notif.recipient_id,
                "recipient_role": role_enum.value,
                "title": sys_notif.title,
                "message": sys_notif.message,
                "priority": prio_enum.value,
                "action_url": sys_notif.action_url,
                "created_at": now_utc.isoformat()
            }
        }

        # Broadcast to specific channel based on targeting
        channel = f"notifications:{role_enum.value.lower()}"
        try:
            await redis_service.publish(channel, event_payload)
            # Also publish to global channel if not ALL
            if role_enum != NotificationRole.ALL:
                await redis_service.publish("notifications:all", event_payload)
        except Exception as e:
            logger.warning(f"Failed to publish system notification to Redis: {e}")

        return NotificationResponse(
            notification_id=sys_notif.id,
            channel="SYSTEM",
            status="SENT",
            recipient=request.recipient_id or f"ROLE_{role_enum.value}",
            delivered_at=now_utc,
            message_id=f"notif_{sys_notif.id}"
        )
