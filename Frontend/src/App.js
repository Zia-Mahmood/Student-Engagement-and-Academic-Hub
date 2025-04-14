import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Fetching authentication status from the server
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/isAuth", {
          method: "GET",
          credentials: "include", // Include cookies for session management
        });

        if (response.ok) {
          const userSession = await response.json();
          setIsAuthenticated(true); // Set authenticated to true if successful
          console.log("Authenticated:", userSession);
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
    fetch("http://localhost:5001/api/logout", {
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
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/home" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <Home onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Login />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
