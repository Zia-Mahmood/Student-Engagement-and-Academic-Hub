import "./App.css";
import "tailwindcss";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Clubs from "./components/Clubs";
import ClubDetail from "./components/ClubDetail";
import StudentBody from "./components/StudentBody";
import Events from "./components/Events";
import Calendar from "./components/Calendar";
import JoinClub from "./components/JoinClub";
import Dashboard from "./components/Dashboard";
import Courses from "./components/Courses";
import Faculty from "./components/Faculty";
import CoursesId from "./components/CoursesId";
import FacultyId from "./components/FacultyId";
import Research from "./components/Research";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const url = "http://localhost:3000/api";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Fetching authentication status from the server
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log(url);
        const response = await fetch(url + "/isAuth", {
          method: "GET",
          withcredentials: "include", // Include cookies for session management
          credentials: "include",
        });

        if (response.ok) {
          const userSession = await response.json();
          setIsAuthenticated(true); // Set authenticated to true if successful
          console.log("Authenticated:", userSession, isAuthenticated);
        } else {
          console.log("Authentication check failed:", response.status);
          setIsAuthenticated(false); // Set authenticated to false if failed
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkAuth();
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true); // Update authentication status on successful login
  };

  const handleLogout = () => {
    fetch(url + "/logout", {
      method: "GET",
      credentials: "include",
    })
      .then(() => {
        setIsAuthenticated(false);
        console.log("authentication is false");
      })
      .catch((err) => console.log("Logout failed:", err));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/clubs/:clubId"
            element={
              isAuthenticated ? <ClubDetail /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/clubs"
            element={isAuthenticated ? <Clubs /> : <Navigate to="/login" />}
          />
          <Route
            path="/student-bodies"
            element={
              isAuthenticated ? <StudentBody /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/events"
            element={isAuthenticated ? <Events /> : <Navigate to="/login" />}
          />
          <Route
            path="/calendar"
            element={isAuthenticated ? <Calendar /> : <Navigate to="/login" />}
          />
          <Route
            path="/join-club"
            element={isAuthenticated ? <JoinClub /> : <Navigate to="/login" />}
          />
          <Route
            path="/courses"
            element={isAuthenticated ? <Courses /> : <Navigate to="/login" />}
          />
          <Route
            path="/courses/:id"
            element={isAuthenticated ? <CoursesId /> : <Navigate to="/login" />}
          />
          <Route
            path="/faculty"
            element={isAuthenticated ? <Faculty /> : <Navigate to="/login" />}
          />
          <Route
            path="/faculty/:id"
            element={isAuthenticated ? <FacultyId /> : <Navigate to="/login" />}
          />
          <Route
            path="/projects"
            element={isAuthenticated ? <Research /> : <Navigate to="/login" />}
          />
        </Route>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
