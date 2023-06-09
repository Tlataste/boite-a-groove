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
import { checkUserStatus } from "./UsersUtils";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

export default function App() {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const providerValue = useMemo(
    () => ({ user, setUser, isAuthenticated, setIsAuthenticated }),
    [user, setUser, isAuthenticated, setIsAuthenticated]
  );

  useEffect(() => {
    checkUserStatus(setUser, setIsAuthenticated);
  }, []);

  return (
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
  );
}

const appDiv = document.getElementById("app");
createRoot(appDiv).render(<App />);
