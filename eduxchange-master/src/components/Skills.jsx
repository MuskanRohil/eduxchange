import React, { useState, useEffect } from "react";
import api from "../services/api";

const getLevelBadgeClass = (level) => {
  if (!level) return "";
  switch (level.toLowerCase()) {
    case "beginner": return "badge badge-beginner";
    case "intermediate": return "badge badge-intermediate";
    case "expert": return "badge badge-expert";
    default: return "badge";
  }
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [matches, setMatches] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [newLevel, setNewLevel] = useState("Beginner");
  const [newType, setNewType] = useState("TEACH");
  const [loading, setLoading] = useState(false);
  const [addMsg, setAddMsg] = useState("");

  useEffect(() => {
    fetchSkills();
    fetchMatches();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await api.get("/skills");
      setSkills(res.data);
    } catch (err) {
      console.error("Failed to load skills", err);
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await api.get("/skills/matches");
      setMatches(res.data);
    } catch (err) {
      console.error("Failed to load matches", err);
    }
  };

  const addSkill = async () => {
    if (!newSkill.trim()) return;
    setLoading(true);
    setAddMsg("");
    try {
      await api.post("/skills", {
        name: newSkill.trim(),
        level: newLevel,
        type: newType,
      });
      setNewSkill("");
      setNewLevel("Beginner");
      setNewType("TEACH");
      setAddMsg("Skill added successfully!");
      await fetchSkills();
      await fetchMatches();
    } catch (err) {
      setAddMsg("Failed to add skill. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setAddMsg(""), 3000);
    }
  };

   const requestSession = async (match) => {
     const time = prompt(
       "Enter time (YYYY-MM-DD HH:mm)",
       "2026-05-02 14:00"
     );

     if (!time) return;

     const payload = {
       receiverId: match.user?.id,
       skillId: match.id,
       scheduledTime: time,
     };

     console.log("DEBUG payload:", payload);

     try {
       const res = await api.post("/sessions/request", payload);
       console.log("SUCCESS:", res.data);
       alert("Session request sent successfully 🎉");
     } catch (err) {
       console.error("ERROR:", err.response?.data || err.message);
       alert("Failed to request session. Check console.");
     }
   };


  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h2>Skills Exchange</h2>
        <p>Add what you can teach, what you want to learn, and find your matches.</p>
      </div>

      <div className="skills-grid">
        {/* Left column — Add skill + My skills */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Add Skill Panel */}
          <div className="glass-panel">
            <h3><span>✨</span> Add a Skill</h3>

            <div className="form-group">
              <label htmlFor="skill-name">Skill name</label>
              <input
                id="skill-name"
                type="text"
                placeholder="e.g. Python, Graphic Design, Guitar…"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
              />
            </div>

            <div className="form-group">
              <label htmlFor="skill-level">Proficiency level</label>
              <select id="skill-level" value={newLevel} onChange={(e) => setNewLevel(e.target.value)}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="skill-type">I want to…</label>
              <select id="skill-type" value={newType} onChange={(e) => setNewType(e.target.value)}>
                <option value="TEACH">Teach this skill</option>
                <option value="LEARN">Learn this skill</option>
              </select>
            </div>

            <button
              className="btn-primary"
              onClick={addSkill}
              disabled={loading}
              style={{ marginTop: "8px" }}
            >
              {loading ? "Adding…" : "Add Skill"}
            </button>

            {addMsg && (
              <p className={addMsg.includes("success") ? "alert alert-success" : "alert alert-error"} style={{ marginTop: "12px" }}>
                {addMsg}
              </p>
            )}
          </div>

          {/* My Skills Panel */}
          <div className="glass-panel">
            <h3><span>🧩</span> My Skills</h3>
            {skills.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📋</span>
                <p>No skills added yet.<br />Add your first skill above!</p>
              </div>
            ) : (
              <div className="skills-list">
                {skills.map((skill) => (
                  <div key={skill.id} className="skill-item">
                    <span className="skill-name">{skill.name}</span>
                    <div className="skill-badges">
                      <span className={getLevelBadgeClass(skill.level)}>{skill.level}</span>
                      <span className={skill.type === "TEACH" ? "badge badge-teach" : "badge badge-learn"}>
                        {skill.type === "TEACH" ? "Teaching" : "Learning"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column — Matches */}
        <div className="glass-panel">
          <h3><span>🎯</span> Skill Matches</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "20px" }}>
            People whose skills complement yours
          </p>
          {matches.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <p>No matches yet.<br />Add more skills to find people to exchange with!</p>
            </div>
          ) : (
            <div className="skills-list">
              {matches.map((match) => (
                <div key={match.id} className="match-item">
                  <div className="match-avatar">{getInitial(match.user.name)}</div>
                  <div className="match-info">
                    <div className="match-name">{match.user.name}</div>
                    <div className="match-email">{match.user.email}</div>
                    <div style={{ fontSize: "12px", color: "var(--primary-color)", marginTop: "4px" }}>
                      Teaches: {match.name} ({match.level})
                    </div>
                  </div>
                      <button className="btn-sm" onClick={() => requestSession(match)}>
                          Request Session
                      </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Skills;
