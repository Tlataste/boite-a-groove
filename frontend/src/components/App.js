import React, { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { render } from "react-dom";
import HomePage from "./HomePage";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import MusicBox from "./MusicBox/MusicBox";
import UserProfilePage from "./UserProfilePage";
import { UserContext } from "./UserContext";
import MenuAppBar from "./Menu";
import Box from "@mui/material/Box";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

export default function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const providerValue = useMemo(
    () => ({ user, setUser, isAuthenticated, setIsAuthenticated }),
    [user, setUser, isAuthenticated, setIsAuthenticated]
  );

  const checkUserStatus = async () => {
    try {
      const response = await fetch("/users/check-authentication");
      const data = await response.json();
      if (response.ok) {
        console.log("Authenticated");
        setUser(data.username);
        setIsAuthenticated(true);
      } else {
        console.log("Not authenticated");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: "linear-gradient(to right, #C9D6FF, #E2E2E2)",
        overflow: "auto",
      }}
    >
      <Router>
        <UserContext.Provider value={providerValue}>
          <MenuAppBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/box/:boxName" element={<MusicBox />} />
          </Routes>
        </UserContext.Provider>
      </Router>
    </Box>
  );
}

const appDiv = document.getElementById("app");
createRoot(appDiv).render(<App />);
