"""
========================================================================================
SOCIAL-X CIVIC OPERATING SYSTEM - CONSOLIDATED SINGLE BACKEND APPLICATION
========================================================================================
Run:
  python app.py
  OR
  uvicorn app:app --port 8000 --reload

This single file unifies all 4 previous microservices:
  - Backend 1 (Core Service - Auth, Users, Issues)
  - Backend 2 (Social-X Gateway & AI OCR/Speech)
  - Backend 3 (Routing & Governance 8-Stage Workflow Engine & Matchmaker)
  - Backend 4 (Analytics, Reports, Email & System Notifications, WebSocket Live Stream)
========================================================================================
"""

import sys
from pathlib import Path

# Add root directory to sys.path
ROOT_DIR = Path(__file__).resolve().parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

# Import the complete, fully-featured unified application and utilities
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
    # Launch transparent background proxies on legacy ports 8001, 8002, 8003, 8004
    launch_proxies()
    print("====================================================================")
    print("  SOCIAL-X CIVIC OPERATING SYSTEM - CONSOLIDATED BACKEND RUNNER     ")
    print("====================================================================")
    print(f"  Primary Backend URL       : http://localhost:{PRIMARY_PORT}")
    print(f"  Interactive Swagger Docs  : http://localhost:{PRIMARY_PORT}/docs")
    print(f"  Live WebSocket Stream     : ws://localhost:{PRIMARY_PORT}/live")
    print(f"  Active Port Proxies       : {', '.join(str(p) for p in FORWARD_PORTS)}")
    print("====================================================================")
    uvicorn.run("app:app", host="0.0.0.0", port=PRIMARY_PORT, reload=True)
