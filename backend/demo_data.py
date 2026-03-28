"""
demo_data.py — Pre-loaded demo sessions for the hackathon demo.
Generates 3 realistic sessions with different gap times (30 min, 3 hours, 1 day ago).
"""

import uuid
from datetime import datetime, timedelta, timezone


def get_demo_sessions():
    """Return a dict of 3 demo sessions keyed by their ID."""
    now = datetime.now(timezone.utc)

    sessions = {}

    # ── Session 1: paused 30 minutes ago ──────────────────────────────
    s1_id = str(uuid.uuid4())
    sessions[s1_id] = {
        "id": s1_id,
        "title": "Fix authentication bug in login flow",
        "notes": "The JWT token refresh is failing silently when the access token expires.\n"
                 "Need to check the interceptor in api.js and the /refresh endpoint.\n"
                 "Suspect the refresh token cookie isn't being sent with credentials.",
        "youtube_link": "https://www.youtube.com/playlist?list=PL4cUxeGkcC9g8OhpOZxNdxX1hB_A02iK",
        "revision_summary": "Revise JWT token lifecycles and HTTP-only cookie security tomorrow.",
        "links": [
            "https://github.com/team/project/issues/42",
            "https://jwt.io/",
            "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies",
        ],
        "checklist": [
            {"text": "Reproduce the bug with expired token", "done": True},
            {"text": "Check interceptor config in api.js", "done": True},
            {"text": "Verify refresh endpoint sets httpOnly cookie", "done": False},
            {"text": "Add automatic retry on 401 response", "done": False},
            {"text": "Write integration test for token refresh", "done": False},
        ],
        "status": "paused",
        "elapsed_seconds": 2700,            # 45 min of work
        "paused_at": (now - timedelta(minutes=30)).isoformat(),
        "started_at": (now - timedelta(hours=1, minutes=15)).isoformat(),
        "created_at": (now - timedelta(hours=1, minutes=15)).isoformat(),
    }

    # ── Session 2: paused 3 hours ago ─────────────────────────────────
    s2_id = str(uuid.uuid4())
    sessions[s2_id] = {
        "id": s2_id,
        "title": "Design dashboard analytics component",
        "notes": "Working on the weekly usage chart. Using Recharts for graphs.\n"
                 "Need to aggregate data by day and show tooltips on hover.\n"
                 "Color palette should match the brand guide (blue-500 primary).",
        "youtube_link": "https://www.youtube.com/watch?v=0kRoZcLCE6I&list=PLZlA0Gpn_vH9i0J0B1uE6e1Q47hX1g8gU",
        "revision_summary": "Review Recharts ResponsiveContainer and Tooltip customizations.",
        "links": [
            "https://recharts.org/en-US/api",
            "https://www.figma.com/file/abc123/Dashboard-Designs",
        ],
        "checklist": [
            {"text": "Set up Recharts in the project", "done": True},
            {"text": "Create BarChart component with mock data", "done": True},
            {"text": "Implement data aggregation helper", "done": False},
            {"text": "Add hover tooltips with formatted values", "done": False},
            {"text": "Responsive layout for mobile", "done": False},
            {"text": "Connect to live API data", "done": False},
        ],
        "status": "paused",
        "elapsed_seconds": 5400,            # 1.5 hours of work
        "paused_at": (now - timedelta(hours=3)).isoformat(),
        "started_at": (now - timedelta(hours=4, minutes=30)).isoformat(),
        "created_at": (now - timedelta(hours=4, minutes=30)).isoformat(),
    }

    # ── Session 3: paused 1 day ago ───────────────────────────────────
    s3_id = str(uuid.uuid4())
    sessions[s3_id] = {
        "id": s3_id,
        "title": "Refactor database migration scripts",
        "notes": "Migrating from SQLite to PostgreSQL for production.\n"
                 "Need to rewrite the seed script and update the ORM config.\n"
                 "Also need to handle the JSONB column type differences.\n"
                 "Asked DevOps for staging DB credentials — waiting on access.",
        "youtube_link": "https://www.youtube.com/watch?v=sM2yTf5IqN4&list=PL6gx4Cwl9DGCkg2Il3HzNC1Ph3T_rs200",
        "revision_summary": "Study PostgreSQL JSONB indexing and SQLAlchemy 2.0 migration patterns.",
        "links": [
            "https://docs.sqlalchemy.org/en/20/dialects/postgresql.html",
            "https://wiki.internal.company/db-migration-guide",
            "https://github.com/team/project/pull/87",
        ],
        "checklist": [
            {"text": "Backup current SQLite database", "done": True},
            {"text": "Update SQLAlchemy connection string", "done": True},
            {"text": "Rewrite seed script for PostgreSQL", "done": False},
            {"text": "Handle JSONB column migration", "done": False},
            {"text": "Test on staging environment", "done": False},
            {"text": "Update CI/CD pipeline config", "done": False},
            {"text": "Document rollback procedure", "done": False},
        ],
        "status": "paused",
        "elapsed_seconds": 7200,            # 2 hours of work
        "paused_at": (now - timedelta(days=1)).isoformat(),
        "started_at": (now - timedelta(days=1, hours=2)).isoformat(),
        "created_at": (now - timedelta(days=1, hours=2)).isoformat(),
    }

    return sessions
