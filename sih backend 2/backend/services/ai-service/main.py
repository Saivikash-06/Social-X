"""Entry point for AI Service."""

import os
import sys

# Add directory to sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", ".."))
WORKSPACE_DIR = os.path.abspath(os.path.join(BACKEND_DIR, ".."))

for p in [CURRENT_DIR, BACKEND_DIR, WORKSPACE_DIR]:
    if p not in sys.path:
        sys.path.insert(0, p)

import uvicorn
from app.main import app
from app.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
