import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import { useEffect, useState } from "react";

const url = "http://localhost:3000/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  useEffect(() => {
    fetch(url+"/isAuth", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.name) setUser(data.name);
      })
      .catch((err) => console.error("Auth check failed", err));
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      <h1>Student Engagement Hub</h1>
      <h3>Welcome Back, {user}</h3>

      {/* AI Search Bar */}
      <div className="ai-search-bar">
        <input type="text" placeholder="Ask anything..." />
        <button>Search</button>
      </div>

      {/* Events Calendar */}
      <div className="dashboard-section">
        <h2>Events & Clubs</h2>
        <ul>
          <li onClick={() => handleNavigation("/calendar")}>View Calendar</li>
          <li onClick={() => handleNavigation("/clubs/register")}>
            Register to a Club
          </li>
          <li onClick={() => handleNavigation("/events/volunteer")}>
            Volunteer for Events
          </li>
          <li onClick={() => handleNavigation("/events")}>Look for Events</li>
        </ul>
      </div>

      {/* Academics */}
      <div className="dashboard-section">
        <h2>Academic Resources</h2>
        <ul>
          <li onClick={() => handleNavigation("/faculty-reviews")}>
            Faculty Reviews
          </li>
          <li onClick={() => handleNavigation("/courses")}>Course Listing</li>
          <li onClick={() => handleNavigation("/course-reviews")}>
            Course Reviews
          </li>
          <li onClick={() => handleNavigation("/previous-papers")}>
            Previous Papers
          </li>
        </ul>
      </div>

      {/* Research */}
      <div className="dashboard-section">
        <h2>Research</h2>
        <ul>
          <li onClick={() => handleNavigation("/faculty-profiles")}>
            Faculty Profiles
          </li>
          <li onClick={() => handleNavigation("/approach-faculty")}>
            How to Approach Faculty
          </li>
          <li onClick={() => handleNavigation("/projects")}>
            Current Projects
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
