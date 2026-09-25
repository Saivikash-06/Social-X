import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Set
from fastapi import WebSocket
from app.core.redis import redis_service

logger = logging.getLogger(__name__)


class WebSocketConnectionManager:
    def __init__(self):
        # Map websocket -> set of subscribed channels
        self.active_connections: Dict[WebSocket, Set[str]] = {}
        # Map channel -> set of subscribed websockets
        self.channel_map: Dict[str, Set[WebSocket]] = {}
        self._lock = asyncio.Lock()
        self._redis_listeners_registered: Set[str] = set()

    async def connect(self, websocket: WebSocket, initial_channels: Optional[List[str]] = None) -> None:
        await websocket.accept()
        channels = set(initial_channels or ["public", "notifications:all"])

        async with self._lock:
            self.active_connections[websocket] = set()
            for ch in channels:
                self._add_to_channel(websocket, ch)

        # Welcome message
        welcome_frame = {
            "event": "CONNECTED",
            "message": "Connected to Governance Real-time Stream",
            "subscribed_channels": list(channels),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await websocket.send_text(json.dumps(welcome_frame))

        # Register Redis pubsub listeners for these channels if not registered
        for ch in channels:
            await self._ensure_redis_listener(ch)

    async def disconnect(self, websocket: WebSocket) -> None:
        async with self._lock:
            subs = self.active_connections.pop(websocket, set())
            for ch in subs:
                if ch in self.channel_map and websocket in self.channel_map[ch]:
                    self.channel_map[ch].remove(websocket)
                    if not self.channel_map[ch]:
                        del self.channel_map[ch]
        logger.info("WebSocket disconnected and cleaned up.")

    def _add_to_channel(self, websocket: WebSocket, channel: str) -> None:
        if websocket not in self.active_connections:
            self.active_connections[websocket] = set()
        self.active_connections[websocket].add(channel)

        if channel not in self.channel_map:
            self.channel_map[channel] = set()
        self.channel_map[channel].add(websocket)

    async def subscribe(self, websocket: WebSocket, channel: str) -> None:
        async with self._lock:
            self._add_to_channel(websocket, channel)
        await self._ensure_redis_listener(channel)

        confirm_frame = {
            "event": "SUBSCRIBED",
            "channel": channel,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await websocket.send_text(json.dumps(confirm_frame))

    async def unsubscribe(self, websocket: WebSocket, channel: str) -> None:
        async with self._lock:
            if websocket in self.active_connections:
                self.active_connections[websocket].discard(channel)
            if channel in self.channel_map:
                self.channel_map[channel].discard(websocket)

        confirm_frame = {
            "event": "UNSUBSCRIBED",
            "channel": channel,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await websocket.send_text(json.dumps(confirm_frame))

    async def broadcast_to_channel(self, channel: str, message: Any) -> int:
        msg_str = json.dumps(message) if not isinstance(message, str) else message
        async with self._lock:
            sockets = list(self.channel_map.get(channel, []))

        count = 0
        for ws in sockets:
            try:
                await ws.send_text(msg_str)
                count += 1
            except Exception as e:
                logger.warning(f"Failed to send to websocket on channel {channel}: {e}")
        return count

    async def broadcast_all(self, message: Any) -> int:
        msg_str = json.dumps(message) if not isinstance(message, str) else message
        async with self._lock:
            sockets = list(self.active_connections.keys())

        count = 0
        for ws in sockets:
            try:
                await ws.send_text(msg_str)
                count += 1
            except Exception:
                pass
        return count

    async def _ensure_redis_listener(self, channel: str) -> None:
        if channel in self._redis_listeners_registered:
            return

        async def redis_callback(msg_str: str):
            try:
                data = json.loads(msg_str)
            except Exception:
                data = msg_str
            await self.broadcast_to_channel(channel, data)

        await redis_service.subscribe(channel, redis_callback)
        self._redis_listeners_registered.add(channel)


ws_manager = WebSocketConnectionManager()
