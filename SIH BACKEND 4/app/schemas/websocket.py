from datetime import datetime, timezone
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class WSClientAction(BaseModel):
    action: str = Field(..., description="subscribe, unsubscribe, ping, broadcast")
    channel: Optional[str] = Field(None, description="Target channel or topic")
    payload: Optional[Dict[str, Any]] = Field(default_factory=dict)


class WSServerMessage(BaseModel):
    event: str
    channel: Optional[str] = None
    data: Any = None
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
