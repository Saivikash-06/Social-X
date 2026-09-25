import uuid
from datetime import datetime, timezone
from typing import Optional


def utc_now() -> datetime:
    """Return current UTC datetime."""
    return datetime.now(timezone.utc)


def generate_uuid() -> str:
    """Generate a clean UUIDv4 string."""
    return str(uuid.uuid4())


def format_iso(dt: Optional[datetime]) -> Optional[str]:
    """Format datetime as ISO string."""
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat()
