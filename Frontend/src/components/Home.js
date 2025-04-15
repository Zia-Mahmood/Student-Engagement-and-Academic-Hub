import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Dashboard.css";

const url = "http://localhost:3000/api";

const sections = [
  {
    id: "events",
    title: "Events & Clubs",
    items: [
      { label: "Register to a Club", path: "/clubs/register" },
      { label: "Volunteer for Events", path: "/events/volunteer" },
      { label: "Look for Events", path: "/events" },
    ],
  },
  {
    id: "academics",
    title: "Academic Resources",
    items: [
      { label: "Faculty Reviews", path: "/faculty-reviews" },
      { label: "Course Listing", path: "/courses" },
      { label: "Course Reviews", path: "/course-reviews" },
      { label: "Previous Papers", path: "/previous-papers" },
    ],
  },
  {
    id: "research",
    title: "Research",
    items: [
      { label: "Faculty Profiles", path: "/faculty-profiles" },
      { label: "How to Approach Faculty", path: "/approach-faculty" },
      { label: "Current Projects", path: "/projects" },
    ],
  },
];

const Home = ({}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [openSection, setOpenSection] = useState(null);
  useEffect(() => {
    fetch(url + "/isAuth", {
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

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
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

      {/* Events Calendar Displayed Directly */}
      <div className="calendar-placeholder">
        <h2>Events Calendar</h2>
        <p>[Calendar Component Placeholder]</p>
      </div>

      {/* Dynamic Sections */}
      {sections.map((section) => (
        <div className="dashboard-section" key={section.id}>
          <h2 onClick={() => toggleSection(section.id)}>{section.title}</h2>
          <AnimatePresence>
            {openSection === section.id && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {section.items.map((item, idx) => (
                  <li key={idx} onClick={() => handleNavigation(item.path)}>
                    {item.label}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default Home;
