import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? "#f0f4ff" : undefined,
    background: isActive ? "rgba(255,255,255,0.08)" : undefined,
  });

  return (
    <header className="header">
      <Link to={user ? "/dashboard" : "/login"} style={{ textDecoration: "none" }}>
        <h1>EduXchange</h1>
      </Link>
      <nav>
        {user ? (
          <>
            <NavLink to="/dashboard" style={navLinkStyle}>Dashboard</NavLink>
            <NavLink to="/skills" style={navLinkStyle}>Skills</NavLink>
            <NavLink to="/sessions" style={navLinkStyle}>Sessions</NavLink>
            <NavLink to="/profile" style={navLinkStyle}>Profile</NavLink>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" style={navLinkStyle}>Login</NavLink>
            <NavLink to="/register" style={navLinkStyle}>Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
