import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async () => {
    if (!name || !email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.response?.data || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") register();
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h2>Create account</h2>
        <p className="form-subtitle">Join EduXchange — learn and teach for free</p>

        <div className="form-group">
          <label htmlFor="reg-name">Full name</label>
          <input
            id="reg-name"
            type="text"
            placeholder="Jane Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-email">Email address</label>
          <input
            id="reg-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="new-password"
          />
        </div>

        <button className="btn-primary" onClick={register} disabled={loading}>
          {loading ? "Creating account…" : "Create Account"}
        </button>

        {errorMsg && <p className="error">{errorMsg}</p>}

        <p>
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
