import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    // Basic email format check
    if (!email.includes("@") || !email.includes(".")) {
      setErrorMsg("Please enter a valid email address (e.g. you@example.com)");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("loggedInUser", JSON.stringify(response.data));
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") login();
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h2>Welcome back</h2>
        <p className="form-subtitle">Sign in to your EduXchange account</p>

        <div className="form-group">
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="current-password"
          />
        </div>

        <button className="btn-primary" onClick={login} disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>

        {errorMsg && <p className="error">{errorMsg}</p>}

        <p>
          Don't have an account?{" "}
          <Link to="/register">Create one for free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
