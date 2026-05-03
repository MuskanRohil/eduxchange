import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const getStatusClass = (status) => {
  switch (status?.toUpperCase()) {
    case "PENDING": return "status-badge status-pending";
    case "ACCEPTED": return "status-badge status-accepted";
    case "REJECTED": return "status-badge status-rejected";
    default: return "status-badge";
  }
};

const Sessions = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const [incRes, outRes] = await Promise.all([
        api.get("/sessions/incoming"),
        api.get("/sessions/outgoing"),
      ]);
      setIncoming(incRes.data);
      setOutgoing(outRes.data);
    } catch (err) {
      console.error("Failed to load sessions", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/sessions/${id}/status?status=${status}`);
      fetchSessions();
    } catch (err) {
      console.error("Failed to update session status", err);
    }
  };

  const giveRating = async (reviewedId) => {
    const score = prompt("Rate this user (1 to 5):", "5");
    if (!score) return;
    const feedback = prompt("Enter your feedback:", "Great session!");
    if (feedback === null) return;

    try {
      await api.post("/sessions/rating", {
        reviewedId,
        score: parseInt(score),
        feedback
      });
      alert("Rating submitted! ⭐");
    } catch (err) {
      alert("Failed to submit rating. You might have already rated them.");
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h2>Sessions</h2>
        <p>Manage your incoming and outgoing skill-exchange requests.</p>
      </div>

      <div className="sessions-grid">
        {/* Incoming */}
        <div>
          <div className="glass-panel">
            <h3><span>📥</span> Incoming Requests</h3>
            {incoming.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p>No incoming requests yet.<br />Share your skills to get discovered!</p>
              </div>
            ) : (
              incoming.map((session) => (
                <div key={session.id} className="session-card" style={{ marginBottom: "16px" }}>
                  <h3>From: {session.requester?.name || "Unknown"}</h3>
                  <p>🎓 Skill: <strong>{session.skill?.name || "N/A"}</strong></p>
                  {session.scheduledTime && (
                    <p>⏰ Time: <strong style={{ color: "var(--primary-color)" }}>{session.scheduledTime}</strong></p>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                    <span className={getStatusClass(session.status)}>
                      {session.status}
                    </span>
                    {session.status === "ACCEPTED" && (
                      <Link to={`/chat/${session.requester?.id}`} className="btn-sm" style={{ textDecoration: "none" }}>
                        💬 Chat
                      </Link>
                    )}
                  </div>
                  
                  {session.status === "PENDING" && (
                    <div className="session-actions" style={{ marginTop: "12px" }}>
                      <button
                        className="btn-accept"
                        onClick={() => updateStatus(session.id, "ACCEPTED")}
                      >
                        ✓ Accept
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => updateStatus(session.id, "REJECTED")}
                      >
                        ✕ Decline
                      </button>
                    </div>
                  )}

                  {session.status === "ACCEPTED" && (
                    <button className="btn-secondary btn-sm" style={{ marginTop: "12px", width: "100%" }} onClick={() => giveRating(session.requester?.id)}>
                      ⭐ Rate User
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Outgoing */}
        <div>
          <div className="glass-panel">
            <h3><span>📤</span> Outgoing Requests</h3>
            {outgoing.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📫</span>
                <p>No outgoing requests.<br />Find matches in the Skills tab and request a session!</p>
              </div>
            ) : (
              outgoing.map((session) => (
                <div key={session.id} className="session-card" style={{ marginBottom: "16px" }}>
                  <h3>To: {session.receiver?.name || "Unknown"}</h3>
                  <p>🎓 Skill: <strong>{session.skill?.name || "N/A"}</strong></p>
                  {session.scheduledTime && (
                    <p>⏰ Time: <strong style={{ color: "var(--primary-color)" }}>{session.scheduledTime}</strong></p>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                    <span className={getStatusClass(session.status)}>
                      {session.status}
                    </span>
                    {session.status === "ACCEPTED" && (
                      <Link to={`/chat/${session.receiver?.id}`} className="btn-sm" style={{ textDecoration: "none" }}>
                        💬 Chat
                      </Link>
                    )}
                  </div>

                  {session.status === "ACCEPTED" && (
                    <button className="btn-secondary btn-sm" style={{ marginTop: "12px", width: "100%" }} onClick={() => giveRating(session.receiver?.id)}>
                      ⭐ Rate User
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sessions;
