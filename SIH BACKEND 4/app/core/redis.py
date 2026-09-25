import asyncio
import json
import logging
from typing import Any, Callable, Dict, List, Optional
import redis.asyncio as aioredis
from app.core.config import settings

logger = logging.getLogger(__name__)


class InMemoryPubSubBroker:
    """Lightweight in-memory Pub/Sub and cache fallback for environments without an active Redis server."""

    def __init__(self):
        self._subscribers: Dict[str, List[Callable[[str], Any]]] = {}
        self._cache: Dict[str, Any] = {}
        self._lock = asyncio.Lock()

    async def publish(self, channel: str, message: str) -> int:
        async with self._lock:
            listeners = list(self._subscribers.get(channel, []))
        count = 0
        for listener in listeners:
            try:
                if asyncio.iscoroutinefunction(listener):
                    asyncio.create_task(listener(message))
                else:
                    listener(message)
                count += 1
            except Exception as e:
                logger.error(f"Error executing listener for channel {channel}: {e}")
        return count

    async def subscribe(self, channel: str, callback: Callable[[str], Any]) -> None:
        async with self._lock:
            if channel not in self._subscribers:
                self._subscribers[channel] = []
            self._subscribers[channel].append(callback)

    async def unsubscribe(self, channel: str, callback: Callable[[str], Any]) -> None:
        async with self._lock:
            if channel in self._subscribers and callback in self._subscribers[channel]:
                self._subscribers[channel].remove(callback)

    async def get(self, key: str) -> Optional[str]:
        return self._cache.get(key)

    async def set(self, key: str, value: str, ex: Optional[int] = None) -> bool:
        self._cache[key] = value
        return True

    async def delete(self, key: str) -> int:
        return 1 if self._cache.pop(key, None) is not None else 0

    async def ping(self) -> bool:
        return True


class RedisService:
    def __init__(self):
        self.redis: Optional[aioredis.Redis] = None
        self.in_memory = InMemoryPubSubBroker()
        self.is_connected = False

    async def connect(self) -> None:
        try:
            client = aioredis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
                socket_timeout=1.5,
                socket_connect_timeout=1.5
            )
            await client.ping()
            self.redis = client
            self.is_connected = True
            logger.info("Connected to Redis server successfully.")
        except Exception as e:
            self.is_connected = False
            self.redis = None
            if settings.USE_IN_MEMORY_REDIS_FALLBACK:
                logger.warning(
                    f"Could not connect to Redis at {settings.REDIS_URL} ({e}). "
                    "Falling back to resilient in-memory broker."
                )
            else:
                raise

    async def disconnect(self) -> None:
        if self.redis:
            await self.redis.close()
            self.is_connected = False

    async def publish(self, channel: str, message: Any) -> int:
        msg_str = json.dumps(message) if not isinstance(message, str) else message
        if self.is_connected and self.redis:
            try:
                return await self.redis.publish(channel, msg_str)
            except Exception as e:
                logger.warning(f"Redis publish failed, using fallback: {e}")
        return await self.in_memory.publish(channel, msg_str)

    async def subscribe(self, channel: str, callback: Callable[[str], Any]) -> None:
        # Registers subscriber on fallback or pubsub task
        await self.in_memory.subscribe(channel, callback)

    async def get_cache(self, key: str) -> Optional[str]:
        if self.is_connected and self.redis:
            try:
                return await self.redis.get(key)
            except Exception:
                pass
        return await self.in_memory.get(key)

    async def set_cache(self, key: str, value: Any, expire_seconds: int = 300) -> bool:
        val_str = json.dumps(value) if not isinstance(value, str) else value
        if self.is_connected and self.redis:
            try:
                return await self.redis.set(key, val_str, ex=expire_seconds)
            except Exception:
                pass
        return await self.in_memory.set(key, val_str, ex=expire_seconds)


redis_service = RedisService()


async def get_redis_service() -> RedisService:
    return redis_service
