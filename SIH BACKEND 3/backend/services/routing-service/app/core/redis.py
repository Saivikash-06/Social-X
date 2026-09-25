import json
import logging
from typing import Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


class CacheClient:
    """
    Redis Cache & Event publisher client with in-memory fallback
    for high availability and zero-crash local development.
    """
    def __init__(self):
        self._redis = None
        self._memory_cache = {}

    async def connect(self):
        if settings.REDIS_ENABLED:
            try:
                import redis.asyncio as aioredis
                self._redis = aioredis.from_url(
                    settings.REDIS_URL,
                    encoding="utf-8",
                    decode_responses=True,
                )
                await self._redis.ping()
                logger.info("Connected to Redis successfully.")
            except Exception as e:
                logger.warning(f"Redis connection failed ({e}). Falling back to internal memory cache.")
                self._redis = None

    async def close(self):
        if self._redis:
            await self._redis.close()

    async def get(self, key: str) -> Optional[Any]:
        if self._redis:
            try:
                val = await self._redis.get(key)
                return json.loads(val) if val else None
            except Exception as e:
                logger.error(f"Redis get error for key '{key}': {e}")
        return self._memory_cache.get(key)

    async def set(self, key: str, value: Any, ttl: int = 3600):
        if self._redis:
            try:
                await self._redis.setex(key, ttl, json.dumps(value))
                return
            except Exception as e:
                logger.error(f"Redis set error for key '{key}': {e}")
        self._memory_cache[key] = value

    async def delete(self, key: str):
        if self._redis:
            try:
                await self._redis.delete(key)
                return
            except Exception as e:
                logger.error(f"Redis delete error for key '{key}': {e}")
        self._memory_cache.pop(key, None)

    async def publish_event(self, channel: str, payload: dict):
        """Publish workflow or routing events to Redis pub/sub."""
        if self._redis:
            try:
                await self._redis.publish(channel, json.dumps(payload))
            except Exception as e:
                logger.error(f"Redis publish error to '{channel}': {e}")
        logger.info(f"[EVENT EMITTED: {channel}] {payload.get('event_type')}")


cache_client = CacheClient()
