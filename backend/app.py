import uuid
from datetime import datetime, timezone

from flask import Flask, jsonify, request
from flask_cors import CORS

from demo_data import get_demo_sessions

app = Flask(__name__)
CORS(app)

# In-memory store: { session_id: { ...session_dict } }
sessions: dict = get_demo_sessions()



def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _seconds_since(iso_str: str) -> float:
    """Return seconds elapsed since the given ISO-8601 timestamp."""
    then = datetime.fromisoformat(iso_str)
    return (datetime.now(timezone.utc) - then).total_seconds()


def _format_gap(seconds: float) -> str:
    """Human-readable gap string, e.g. '3 hours ago', '1 day ago'."""
    minutes = seconds / 60
    hours = minutes / 60
    days = hours / 24

    if days >= 1:
        d = int(days)
        return f"{d} day{'s' if d != 1 else ''} ago"
    if hours >= 1:
        h = int(hours)
        return f"{h} hour{'s' if h != 1 else ''} ago"
    if minutes >= 1:
        m = int(minutes)
        return f"{m} minute{'s' if m != 1 else ''} ago"
    return "just now"



#  1. Create a new session
 
@app.route("/sessions", methods=["POST"])
def create_session():
    data = request.get_json(force=True)
    session_id = str(uuid.uuid4())
    now = _now_iso()

    session = {
        "id": session_id,
        "title": data.get("title", "Untitled Session"),
        "notes": data.get("notes", ""),
        "links": data.get("links", []),
        "checklist": [
            {"text": item, "done": False}
            for item in data.get("checklist", [])
        ],
        "status": "active",
        "elapsed_seconds": 0,
        "started_at": now,
        "created_at": now,
        "paused_at": None,
    }

    sessions[session_id] = session
    return jsonify(session), 201


@app.route("/sessions/<session_id>/pause", methods=["PATCH"])
def pause_session(session_id):
    session = sessions.get(session_id)
    if not session:
        return jsonify({"error": "Session not found"}), 404

    if session["status"] != "active":
        return jsonify({"error": "Session is not active"}), 400

    # Calculate time since the session was last started/resumed
    additional = _seconds_since(session["started_at"])
    session["elapsed_seconds"] += additional
    session["status"] = "paused"
    session["paused_at"] = _now_iso()

    return jsonify(session), 200

 
#  3. Resume the session
 
@app.route("/sessions/<session_id>/resume", methods=["PATCH"])
def resume_session(session_id):
    session = sessions.get(session_id)
    if not session:
        return jsonify({"error": "Session not found"}), 404

    if session["status"] != "paused":
        return jsonify({"error": "Session is not paused"}), 400

    session["status"] = "active"
    session["started_at"] = _now_iso()   # reset timer anchor
    session["paused_at"] = None

    return jsonify(session), 200



#  4.  Update notes / checklist while working

@app.route("/sessions/<session_id>", methods=["PATCH"])
def update_session(session_id):
    session = sessions.get(session_id)
    if not session:
        return jsonify({"error": "Session not found"}), 404

    data = request.get_json(force=True)

    if "notes" in data:
        session["notes"] = data["notes"]

    if "checklist" in data:
        session["checklist"] = data["checklist"]

    if "links" in data:
        session["links"] = data["links"]

    if "title" in data:
        session["title"] = data["title"]

    return jsonify(session), 200

 
#  5. Context restoration payload

@app.route("/sessions/<session_id>/resume-packet", methods=["GET"])
def resume_packet(session_id):
    session = sessions.get(session_id)
    if not session:
        return jsonify({"error": "Session not found"}), 404

    # Calculate how long since the user last worked
    gap_seconds = 0
    gap_label = "just now"
    if session["paused_at"]:
        gap_seconds = _seconds_since(session["paused_at"])
        gap_label = _format_gap(gap_seconds)

    # Filter to pending checklist items ONLY   
    pending_items = [
        item for item in session["checklist"] if not item["done"]
    ]

    packet = {
        "id": session["id"],
        "title": session["title"],
        "notes": session["notes"],
        "links": session["links"],
        "pending_checklist": pending_items,
        "total_checklist_count": len(session["checklist"]),
        "completed_checklist_count": len(session["checklist"]) - len(pending_items),
        "elapsed_seconds": session["elapsed_seconds"],
        "gap_seconds": gap_seconds,
        "gap_label": gap_label,
        "paused_at": session["paused_at"],
        "status": session["status"],
    }

    return jsonify(packet), 200


 
#  6. List all sessions (timeline)

@app.route("/sessions", methods=["GET"])
def list_sessions():
     
    all_sessions = sorted(
        sessions.values(),
        key=lambda s: s["created_at"],
        reverse=True,
    )

     
    result = []
    for s in all_sessions:
        entry = dict(s)
        if s["status"] == "active":
            entry["live_elapsed_seconds"] = (
                s["elapsed_seconds"] + _seconds_since(s["started_at"])
            )
        else:
            entry["live_elapsed_seconds"] = s["elapsed_seconds"]
        result.append(entry)

    return jsonify(result), 200

 
if __name__ == "__main__":
    print(f" Resume Packet API running — {len(sessions)} demo sessions loaded")
    app.run(debug=True, port=5000)
