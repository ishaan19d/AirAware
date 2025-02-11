import React from "react";
import "./Userdashboard.css"; // Ensure the path is correct
import Navbar from "../../components/common/Navbar/Dashboardnav"; // Import Navbar

function UserDashboard() {
  const username = localStorage.getItem("username") || "User"; // Retrieve username from localStorage or use default

  return (
    <div className="user-dashboard">
        <Navbar />

      <div>
        <h1 className="welcome-message">Welcome, {username}!</h1>
       
      </div>
    </div>
  );
}

export default UserDashboard;