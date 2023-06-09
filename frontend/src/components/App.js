import React, { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { render } from "react-dom";
import HomePage from "./HomePage";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import MusicBox from "./MusicBox/MusicBox";
import UserProfilePage from "./UserProfilePage";
import { UserContext } from "./UserContext";

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
      const response = await fetch("/users/is-authenticated");
      const data = await response.json();
      if (response.ok) {
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
    <Router>
      <UserContext.Provider value={providerValue}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/box/:boxName" element={<MusicBox />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

const appDiv = document.getElementById("app");
createRoot(appDiv).render(<App />);
