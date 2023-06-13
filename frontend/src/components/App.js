import React, { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./HomePage";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import MusicBox from "./MusicBox/MusicBox";
import UserProfilePage from "./UserProfilePage";
import { UserContext } from "./UserContext";
import MenuAppBar from "./Menu";
import { useLocation } from "react-router-dom";
import { checkUserStatus } from "./UsersUtils";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Redirect,
  Navigate,
} from "react-router-dom";

export default function App() {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentBoxName, setCurrentBoxName] = useState("");
  const providerValue = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated,
      setIsAuthenticated,
      currentBoxName,
      setCurrentBoxName,
    }),
    [
      user,
      setUser,
      isAuthenticated,
      setIsAuthenticated,
      currentBoxName,
      setCurrentBoxName,
    ]
  );

  useEffect(() => {
    checkUserStatus(setUser, setIsAuthenticated);
  }, []);

  return (
    <Router>
      <UserContext.Provider value={providerValue}>
        <DisplayMenu />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/profile" /> : <RegisterPage />
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/profile" /> : <LoginPage />
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? <UserProfilePage /> : <Navigate to="/login" />
            }
          />
          <Route path="/box/:boxName" element={<MusicBox />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

/**
 * Displays the menu app bar based on the current location.
 * @returns {JSX.Element|null} The JSX element representing the menu app bar or null.
 */
function DisplayMenu() {
  const location = useLocation();
  const shouldRenderMenuAppBar = location.pathname !== "/";

  return <>{shouldRenderMenuAppBar && <MenuAppBar />}</>;
}

const appDiv = document.getElementById("app");
createRoot(appDiv).render(<App />);
