import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ skillCount: 0, sessionCount: 0, averageRating: 0, ratings: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
      fetchProfileStats();
    }
  }, [navigate]);

  const fetchProfileStats = async () => {
    try {
      const res = await api.get("/user/profile");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch profile stats", err);
    }
  };

  if (!user) return null;

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "U";

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= Math.round(rating) ? "#FFD700" : "rgba(255,255,255,0.1)" }}>
          ★
        </span>
      );
    }
    return stars;
  };

  const memberSince = (() => {
    try {
      const d = new Date();
      return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } catch {
      return "2026";
    }
  })();

  return (
    <div className="page-wrapper">
      <div className="profile-page" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="profile glass-panel" style={{ padding: "40px" }}>
          <div className="profile-header" style={{ display: "flex", alignItems: "center", gap: "30px", marginBottom: "40px" }}>
            <div className="profile-avatar" style={{ width: "100px", height: "100px", fontSize: "40px" }}>
              {getInitial(user.name)}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "28px" }}>{user.name}</h2>
              <p className="profile-email" style={{ margin: "5px 0 0", opacity: 0.7 }}>{user.email}</p>
              <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                 <span className="rating-stars" style={{ fontSize: "20px" }}>{renderStars(stats.averageRating)}</span>
                 <strong style={{ fontSize: "18px" }}>{stats.averageRating.toFixed(1)}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
            <div>
              <div className="profile-section-title">Account Details</div>
              <div className="profile-row">
                <span className="row-label">Member Since</span>
                <span className="row-value">{memberSince}</span>
              </div>
              <div className="profile-row">
                <span className="row-label">Skills Shared</span>
                <span className="row-value">{stats.skillCount}</span>
              </div>
              <div className="profile-row">
                <span className="row-label">Sessions Done</span>
                <span className="row-value">{stats.sessionCount}</span>
              </div>
            </div>

            <div>
              <div className="profile-section-title">Recent Feedback</div>
              <div className="reviews-list" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {stats.ratings?.length === 0 ? (
                  <p style={{ opacity: 0.5, fontStyle: "italic" }}>No reviews yet.</p>
                ) : (
                  stats.ratings?.map((r, i) => (
                    <div key={i} className="review-item" style={{ background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                        <span style={{ fontWeight: "600", fontSize: "14px" }}>{r.reviewerName}</span>
                        <span style={{ color: "#FFD700", fontSize: "12px" }}>{"★".repeat(r.score)}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: "13px", opacity: 0.8 }}>"{r.feedback}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <button 
            className="btn-secondary" 
            style={{ marginTop: "40px", width: "100%" }}
            onClick={fetchProfileStats}
          >
            🔄 Refresh Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
