from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, EmailStr, Field


class EmailNotificationRequest(BaseModel):
    recipient_email: EmailStr = Field(..., description="Target email address")
    recipient_name: Optional[str] = Field(None, description="Recipient full name")
    subject: str = Field(..., min_length=3, max_length=255, description="Email subject line")
    body_text: str = Field(..., min_length=3, description="Plain text email body")
    body_html: Optional[str] = Field(None, description="HTML formatted email body")
    template_name: Optional[str] = Field("standard_alert", description="Template identifier")
    extra_metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)


class SystemNotificationRequest(BaseModel):
    recipient_id: Optional[str] = Field(None, description="Specific user/officer ID (optional for targeted alerts)")
    recipient_role: str = Field("ALL", description="Target role: ALL, ADMIN, GOV, UNIVERSITY, INDUSTRY, CITIZEN")
    title: str = Field(..., min_length=3, max_length=200, description="Notification header")
    message: str = Field(..., min_length=3, description="Detailed notification message")
    priority: str = Field("NORMAL", description="Priority level: LOW, NORMAL, HIGH, URGENT")
    action_url: Optional[str] = Field(None, description="Direct URL/Deep-link for frontend action")
    data_payload: Optional[Dict[str, Any]] = Field(default_factory=dict)


class NotificationResponse(BaseModel):
    notification_id: int
    channel: str  # EMAIL or SYSTEM
    status: str   # SENT, PENDING, FAILED
    recipient: str
    delivered_at: datetime
    message_id: Optional[str] = None
