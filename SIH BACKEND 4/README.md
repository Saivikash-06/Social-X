# Smart Governance Platform - Analytics and Notification Microservice

A production-grade, enterprise-ready microservice built with **FastAPI**, **PostgreSQL**, **Redis**, **WebSockets**, and **SMTP** to provide centralized multi-stakeholder dashboards, real-time civic analytics, on-demand reporting, transactional emails, and live event distribution.

---

## 🏛️ Architecture & Key Responsibilities

| Domain | Responsibility | Supported Channels / Protocols |
|---|---|---|
| **Dashboards** | Tailored operational views for 5 key stakeholder groups (Admin, Government, Universities, Industry CSR, Citizens) | REST (`GET /dashboard/*`) |
| **Analytics** | Longitudinal metrics, SLA adherence, district health, category distribution, academic & CSR impact | REST (`GET /analytics`) |
| **Reports** | On-demand generation and export of summary, department, district, and stakeholder reports in JSON or CSV format | REST (`GET /reports`) |
| **Notifications** | Transactional & alert emails via async SMTP, and in-app system notifications targeted by role or recipient ID | REST (`POST /notify/*`), SMTP |
| **Real-Time Stream**| Multi-channel live pub/sub stream for instant ticket state changes, metrics updates, and alerts | WebSockets (`ws://.../live`), Redis |
| **Audit Logs** | Immutable trace of all administrative, system, and reporting actions | Database (`activity_logs`) |

---

## 🚀 Endpoints Specification

### 1. Dashboards
- `GET /dashboard/admin`: Executive KPIs, department resolution leaderboards, category distributions, critical SLA breaches, recent audit logs.
- `GET /dashboard/gov`: Departmental operations backlog, high-priority action items, SLA compliance rate, district breakdown.
  - *Query Params*: `department_id`, `district_id`.
- `GET /dashboard/university`: Research challenge discovery, student innovation team allocations, deployed prototypes.
  - *Query Params*: `university_id`.
- `GET /dashboard/industry`: Corporate CSR budget allocation vs disbursement, active partnerships, impact metrics, open sponsorship opportunities.
  - *Query Params*: `industry_id`.
- `GET /dashboard/citizen`: Public transparency metrics, average days to resolve community issues, personal ticket history and ratings.
  - *Query Params*: `citizen_id`, `district_id`.

### 2. Analytics
- `GET /analytics`: Multi-dimensional metrics engine.
  - *Metrics*: Issues Overview (Resolved, Pending, Escalated, Rejected), Department Performance scores, District Performance rankings, University & Industry participation metrics, Category breakdown trends, and Monthly longitudinal data.
  - *Query Params*: `start_date`, `end_date`, `department_id`, `district_id`, `category`.

### 3. Reports
- `GET /reports`: Generate on-demand reports in JSON or downloadable CSV format.
  - *Query Params*:
    - `report_type`: `SUMMARY`, `DEPARTMENT_PERFORMANCE`, `DISTRICT_PERFORMANCE`, `STAKEHOLDER_COLLABORATION`, `MONTHLY_TRENDS` (default: `SUMMARY`)
    - `format`: `JSON` or `CSV` (default: `JSON`)
    - `start_date`, `end_date`, `department_id`, `district_id`

### 4. Notifications
- `POST /notify/email`: Send transactional emails via SMTP (`aiosmtplib`). Fallback to simulated delivery in mock mode.
  - *Payload*: `recipient_email`, `recipient_name`, `subject`, `body_text`, `body_html`, `template_name`.
- `POST /notify/system`: Dispatch targeted in-app alerts (by `recipient_id` or `recipient_role`: `ADMIN`, `GOV`, `UNIVERSITY`, `INDUSTRY`, `CITIZEN`, `ALL`). Persists in database and broadcasts via WebSocket.
  - *Payload*: `recipient_id`, `recipient_role`, `title`, `message`, `priority`, `action_url`, `data_payload`.

### 5. Real-Time WebSocket
- `WebSocket /live`: Real-time streaming connection.
  - *Connection Query Params*: `role`, `user_id` (auto-subscribes to role/user topics).
  - *Protocol*:
    - Ping: `{"action": "ping"}` $\rightarrow$ `{"event": "pong"}`
    - Subscribe: `{"action": "subscribe", "channel": "admin"}`
    - Unsubscribe: `{"action": "unsubscribe", "channel": "admin"}`
    - Broadcast: `{"action": "broadcast", "channel": "public", "payload": {...}}`

---

## ⚙️ Standard Response Envelopes

Every API endpoint strictly conforms to the shared monorepo envelope contract:

### Success Response:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": {
    "timestamp": "2026-09-15T15:30:00Z",
    "version": "v1",
    "requestId": null,
    "count": null
  }
}
```

### Error Response:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "body.recipient_email",
        "message": "value is not a valid email address",
        "type": "value_error"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-09-15T15:30:00Z",
    "version": "v1"
  }
}
```

---

## 🛠️ Setup & Running

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure credentials:
- `DATABASE_URL`: PostgreSQL URL (e.g. `postgresql+asyncpg://user:pass@localhost:5432/sih_governance`) or SQLite fallback (`sqlite+aiosqlite:///./governance_analytics.db`).
- `REDIS_URL`: Redis connection string (e.g. `redis://localhost:6379/0`).
- `SMTP_*`: SMTP server settings for transactional email delivery.

### 3. Seed Realistic Test Data
```bash
python -m app.seeds.seed_data
```

### 4. Launch the Microservice
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Interactive Swagger & ReDoc API Documentation
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **OpenAPI JSON**: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

---

## 🧪 Running Unit Tests
```bash
python -m pytest -v
```
All 19 unit tests cover all endpoints, mathematical aggregations, CSV downloads, mock SMTP dispatch, and WebSocket streaming.
