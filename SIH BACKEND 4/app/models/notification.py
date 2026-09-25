import enum
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    Enum,
    JSON
)
from app.core.database import Base
from app.models.base import TimestampMixin


class NotificationRole(str, enum.Enum):
    ALL = "ALL"
    ADMIN = "ADMIN"
    GOV = "GOV"
    UNIVERSITY = "UNIVERSITY"
    INDUSTRY = "INDUSTRY"
    CITIZEN = "CITIZEN"


class NotificationPriority(str, enum.Enum):
    LOW = "LOW"
    NORMAL = "NORMAL"
    HIGH = "HIGH"
    URGENT = "URGENT"


class NotificationStatus(str, enum.Enum):
    PENDING = "PENDING"
    SENT = "SENT"
    FAILED = "FAILED"
    READ = "READ"


class SystemNotification(Base, TimestampMixin):
    __tablename__ = "system_notifications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    recipient_id = Column(String(100), nullable=True, index=True)
    recipient_role = Column(Enum(NotificationRole), default=NotificationRole.ALL, nullable=False, index=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    priority = Column(Enum(NotificationPriority), default=NotificationPriority.NORMAL, nullable=False)
    is_read = Column(Boolean, default=False, index=True)
    read_at = Column(DateTime(timezone=True), nullable=True)
    action_url = Column(String(255), nullable=True)
    data_payload = Column(JSON, nullable=True)


class EmailNotificationLog(Base, TimestampMixin):
    __tablename__ = "email_notification_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    recipient_email = Column(String(150), nullable=False, index=True)
    recipient_name = Column(String(150), nullable=True)
    subject = Column(String(255), nullable=False)
    body_text = Column(Text, nullable=False)
    body_html = Column(Text, nullable=True)
    template_name = Column(String(100), nullable=True)
    status = Column(Enum(NotificationStatus), default=NotificationStatus.PENDING, nullable=False, index=True)
    error_message = Column(Text, nullable=True)
    message_id = Column(String(100), nullable=True)
    sent_at = Column(DateTime(timezone=True), nullable=True)
