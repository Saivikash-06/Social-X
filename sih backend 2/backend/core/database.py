"""Database connection layer supporting MongoDB Atlas via Motor and resilient storage."""

import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
import asyncio

try:
    from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
except ImportError:
    AsyncIOMotorClient = None
    AsyncIOMotorDatabase = None

from backend.core.config import settings

logger = logging.getLogger("social_x.database")


class DatabaseManager:
    """Manages async MongoDB connections and in-memory fallback persistence."""

    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db: Optional[AsyncIOMotorDatabase] = None
        self.is_connected: bool = False
        # In-memory document storage for testing and offline development
        self._memory_store: Dict[str, Dict[str, Any]] = {
            "users": {},
            "problems": {},
            "projects": {},
            "solutions": {},
            "audit_logs": {},
        }

    async def connect(self) -> None:
        """Initializes connection to MongoDB Atlas."""
        if AsyncIOMotorClient is None:
            logger.warning("Motor is not installed. Using in-memory database store.")
            self.is_connected = False
            return

        try:
            # Set a 2-second server selection timeout for responsive fallback
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=2000,
            )
            self.db = self.client[settings.MONGODB_DB_NAME]
            # Verify connectivity via ping command
            await self.client.admin.command("ping")
            self.is_connected = True
            logger.info(f"Connected successfully to MongoDB Atlas database: '{settings.MONGODB_DB_NAME}'")
        except Exception as e:
            logger.warning(
                f"MongoDB connection to '{settings.MONGODB_URI}' unavailable ({e}). "
                f"Operating with resilient in-memory collection store."
            )
            self.is_connected = False

    async def disconnect(self) -> None:
        """Closes MongoDB connection pool."""
        if self.client:
            self.client.close()
            self.is_connected = False
            logger.info("MongoDB connection closed.")

    async def check_health(self) -> Dict[str, Any]:
        """Returns database health status and driver information."""
        if self.is_connected and self.client:
            try:
                await self.client.admin.command("ping")
                return {
                    "status": "connected",
                    "engine": "MongoDB Atlas (Motor AsyncIO)",
                    "database": settings.MONGODB_DB_NAME,
                }
            except Exception as e:
                return {
                    "status": "degraded",
                    "engine": "MongoDB Atlas",
                    "error": str(e),
                }
        return {
            "status": "online (resilient in-memory store)",
            "engine": "In-Memory Collection Store",
            "database": settings.MONGODB_DB_NAME,
        }

    # Generic collection CRUD operations
    async def insert_one(self, collection_name: str, document: Dict[str, Any]) -> Dict[str, Any]:
        doc_id = str(document.get("id") or document.get("_id"))
        document["id"] = doc_id
        if self.is_connected and self.db is not None:
            try:
                await self.db[collection_name].insert_one(document)
                return document
            except Exception as e:
                logger.error(f"MongoDB insert error: {e}. Storing in memory fallback.")

        # In-memory storage
        if collection_name not in self._memory_store:
            self._memory_store[collection_name] = {}
        self._memory_store[collection_name][doc_id] = document
        return document

    async def find_one(self, collection_name: str, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if self.is_connected and self.db is not None:
            try:
                doc = await self.db[collection_name].find_one(query)
                if doc:
                    if "_id" in doc and "id" not in doc:
                        doc["id"] = str(doc["_id"])
                    return doc
            except Exception as e:
                logger.error(f"MongoDB query error: {e}. Querying in-memory store.")

        # In-memory query
        col = self._memory_store.get(collection_name, {})
        for doc in col.values():
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                return doc
        return None

    async def find_many(
        self,
        collection_name: str,
        query: Optional[Dict[str, Any]] = None,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        query = query or {}
        if self.is_connected and self.db is not None:
            try:
                cursor = self.db[collection_name].find(query).limit(limit)
                docs = await cursor.to_list(length=limit)
                for doc in docs:
                    if "_id" in doc and "id" not in doc:
                        doc["id"] = str(doc["_id"])
                return docs
            except Exception as e:
                logger.error(f"MongoDB find_many error: {e}. Using in-memory store.")

        # In-memory query
        col = self._memory_store.get(collection_name, {})
        results = []
        for doc in col.values():
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                results.append(doc)
            if len(results) >= limit:
                break
        return results

    async def update_one(
        self,
        collection_name: str,
        query: Dict[str, Any],
        update_data: Dict[str, Any],
    ) -> bool:
        if self.is_connected and self.db is not None:
            try:
                res = await self.db[collection_name].update_one(query, {"$set": update_data})
                return res.modified_count > 0
            except Exception as e:
                logger.error(f"MongoDB update error: {e}")

        # In-memory update
        existing = await self.find_one(collection_name, query)
        if existing:
            existing.update(update_data)
            return True
        return False

    async def count(self, collection_name: str, query: Optional[Dict[str, Any]] = None) -> int:
        docs = await self.find_many(collection_name, query=query, limit=10000)
        return len(docs)


db_manager = DatabaseManager()
