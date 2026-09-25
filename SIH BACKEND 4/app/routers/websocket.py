import json
import logging
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.services.websocket_manager import ws_manager

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Real-Time WebSockets"])


@router.websocket("/live")
async def live_websocket_endpoint(
    websocket: WebSocket,
    role: Optional[str] = Query(None, description="Optional role for auto-subscription (admin, gov, university, industry, citizen)"),
    user_id: Optional[str] = Query(None, description="Optional user ID for personalized notifications")
):
    """
    Real-Time WebSocket Stream (`/live`).
    
    Subscribes to live governance events, ticket state changes, metrics updates, and targeted notifications.
    
    ### Message Protocol:
    - **Ping**: `{"action": "ping"}` -> Responds with `{"event": "pong", "timestamp": "..."}`
    - **Subscribe**: `{"action": "subscribe", "channel": "admin"}`
    - **Unsubscribe**: `{"action": "unsubscribe", "channel": "admin"}`
    - **Broadcast**: `{"action": "broadcast", "channel": "public", "payload": {"text": "hello"}}`
    """
    initial_channels = ["public", "notifications:all"]
    if role:
        initial_channels.append(f"notifications:{role.lower()}")
    if user_id:
        initial_channels.append(f"notifications:user:{user_id}")

    await ws_manager.connect(websocket, initial_channels=initial_channels)

    try:
        while True:
            text_data = await websocket.receive_text()
            try:
                msg = json.loads(text_data)
            except Exception:
                await websocket.send_text(json.dumps({
                    "event": "ERROR",
                    "message": "Invalid JSON frame received",
                    "raw": text_data
                }))
                continue

            action = msg.get("action", "").lower()
            channel = msg.get("channel")

            if action == "ping":
                await websocket.send_text(json.dumps({
                    "event": "pong",
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }))

            elif action == "subscribe" and channel:
                await ws_manager.subscribe(websocket, channel)

            elif action == "unsubscribe" and channel:
                await ws_manager.unsubscribe(websocket, channel)

            elif action == "broadcast":
                target_chan = channel or "public"
                broadcast_payload = {
                    "event": "MESSAGE",
                    "channel": target_chan,
                    "sender": user_id or "anonymous",
                    "payload": msg.get("payload", {}),
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
                await ws_manager.broadcast_to_channel(target_chan, broadcast_payload)

            else:
                await websocket.send_text(json.dumps({
                    "event": "UNRECOGNIZED_ACTION",
                    "action": action,
                    "supported_actions": ["ping", "subscribe", "unsubscribe", "broadcast"]
                }))

    except WebSocketDisconnect:
        await ws_manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket unhandled error: {e}")
        await ws_manager.disconnect(websocket)
