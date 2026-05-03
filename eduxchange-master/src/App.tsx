import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Skills from "./components/Skills";
import Sessions from "./components/Sessions";
import Profile from "./components/Profile";
import Chat from "./components/Chat";

import "./index.css";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat/:userId" element={<Chat />} />
      </Routes>
    </Router>
  );
};

export default App;
