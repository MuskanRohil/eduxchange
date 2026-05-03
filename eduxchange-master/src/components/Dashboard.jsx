import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ skillCount: 0, matchCount: 0, sessionCount: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
      fetchStats();
    }
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const res = await api.get("/user/profile");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h2>
          {user ? `Hey, ${user.name.split(" ")[0]} 👋` : "Welcome to EduXchange"}
        </h2>
        <p>Learn. Teach. Grow — peer-to-peer, without money.</p>
      </section>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-chip">
          <div className="stat-value">{stats.skillCount}</div>
          <div className="stat-label">Skills Added</div>
        </div>
        <div className="stat-chip">
          <div className="stat-value">{stats.matchCount}</div>
          <div className="stat-label">Matches</div>
        </div>
        <div className="stat-chip">
          <div className="stat-value">{stats.sessionCount}</div>
          <div className="stat-label">Sessions</div>
        </div>
      </div>

      {/* About Section */}
      <section className="about">
        <h2>What is EduXchange?</h2>
        <p>
          EduXchange is a peer-to-peer skill exchange platform where students
          trade knowledge — no money involved.
        </p>
        <p>You teach what you know. You learn what you want. Everyone wins.</p>
        <p>
          Our smart matching system pairs you with people who have complementary
          skills, so learning is always just one request away.
        </p>
      </section>

      {/* Feature Cards */}
      <section className="features">
        <div className="card">
          <span className="card-icon">🎓</span>
          <h3>Add Skills</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "20px" }}>
            List what you can teach and what you want to learn.
          </p>
          <button onClick={() => navigate("/skills")}>Go to Skills</button>
        </div>

        <div className="card">
          <span className="card-icon">🤝</span>
          <h3>Find Matches</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "20px" }}>
            Discover peers with skills that match your learning goals.
          </p>
          <button onClick={() => navigate("/skills")}>View Matches</button>
        </div>

        <div className="card">
          <span className="card-icon">📅</span>
          <h3>Book Sessions</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "20px" }}>
            Request and manage your skill-exchange sessions.
          </p>
          <button onClick={() => navigate("/sessions")}>View Sessions</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 EduXchange · Built for learners, by learners</p>
      </footer>
    </div>
  );
};

export default Dashboard;
