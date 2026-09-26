"""
Consolidated Social-X Backend Module Entrypoint.
Usage:
  python -m backend.main
  OR
  uvicorn backend.main:app --port 8000 --reload
"""

import sys
from pathlib import Path

# Add project root to sys.path
CURRENT_DIR = Path(__file__).resolve().parent
ROOT_DIR = CURRENT_DIR.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from unified_backend import (
    app,
    launch_proxies,
    PRIMARY_PORT,
    FORWARD_PORTS,
    init_database,
    seed_defaults,
)

if __name__ == "__main__":
    import uvicorn
    launch_proxies()
    print(f"Starting Social-X Unified Backend on http://localhost:{PRIMARY_PORT}")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=PRIMARY_PORT, reload=True)
