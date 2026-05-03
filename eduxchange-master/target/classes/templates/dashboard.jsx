// <!DOCTYPE html>
// <html>
// <head>
//     <title>Dashboard - EduXchange</title>
//     <link rel="stylesheet" href="../static/css/style.css">
// </head>
// <body>

// <header class="header">
//     <h1>EduXchange</h1>
//     <nav>
//         <a href="dashboard.html">Dashboard</a>
//         <a href="profile.html">Profile</a>
//         <a href="skills.html">Skills</a>
//         <a href="sessions.html">Sessions</a>
//         <a href="#" onclick="logout()">Logout</a>
//     </nav>
// </header>

// <section class="hero">
//     <h2 id="welcomeText">Welcome to EduXchange</h2>
//     <p>Learn. Teach. Grow — Without Money.</p>
// </section>

// <section class="about">
//     <h2>About EduXchange</h2>
//     <p>EduXchange is a peer-to-peer learning platform where students exchange skills without money.</p>
//     <p>You can teach what you know and learn what you want from others.</p>
//     <p>Our goal is to make learning accessible and collaborative.</p>
// </section>

// <section class="features">
//     <div class="card">
//         <h3>Add Skill</h3>
//         <button onclick="location.href='skills.html'">Add Skill</button>
//     </div>

//     <div class="card">
//         <h3>View Matches</h3>
//         <button>View Matches</button>
//     </div>

//     <div class="card">
//         <h3>Sessions</h3>
//         <button onclick="location.href='sessions.html'">View Sessions</button>
//     </div>
// </section>

// <footer class="footer">
//     <p>© 2026 EduXchange</p>
// </footer>

// <script>
// var user = JSON.parse(localStorage.getItem("loggedInUser"));

// if (!user) {
//     window.location.href = "login.html";
// } else {
//     document.getElementById("welcomeText").innerText = "Welcome, " + user.name + " 👋";
// }

// function logout() {
//     localStorage.removeItem("loggedInUser");
//     window.location.href = "login.html";
// }
// </script>

// </body>
// </html>


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <h1>EduXchange</h1>
        <nav>
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button onClick={() => navigate("/skills")}>Skills</button>
          <button onClick={() => navigate("/sessions")}>Sessions</button>
          <button onClick={logout}>Logout</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h2>
          {user ? `Welcome, ${user.name} 👋` : "Welcome to EduXchange"}
        </h2>
        <p>Learn. Teach. Grow — Without Money.</p>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About EduXchange</h2>
        <p>
          EduXchange is a peer-to-peer learning platform where students exchange
          skills without money.
        </p>
        <p>You can teach what you know and learn what you want from others.</p>
        <p>Our goal is to make learning accessible and collaborative.</p>
      </section>

      {/* Features */}
      <section className="features">
        <div className="card">
          <h3>Add Skill</h3>
          <button onClick={() => navigate("/skills")}>Add Skill</button>
        </div>

        <div className="card">
          <h3>View Matches</h3>
          <button>View Matches</button>
        </div>

        <div className="card">
          <h3>Sessions</h3>
          <button onClick={() => navigate("/sessions")}>
            View Sessions
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 EduXchange</p>
      </footer>
    </div>
  );
};

export default Dashboard;