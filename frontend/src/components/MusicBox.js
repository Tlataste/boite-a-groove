import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "./Menu";
import LiveSearch from "./LiveSearch";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  // States & Variables
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false);
  const { boxName } = useParams();
  const navigate = useNavigate();

  /**
   * Function to be executed when the component is mounted and the page is loaded
   * Check on page load (only) if the user is authenticated with spotify
   */
  useEffect(() => {
    checkSpotifyAuthentication();
    getBoxDetails();
  }, []); // Empty dependency array ensures the effect is only run once

  /**
   * Checks if the user is authenticated with Spotify.
   * Makes an asynchronous request to the server to fetch the authentication status.
   * Updates the state variable 'isSpotifyAuthenticated' based on the response.
   */
  const checkSpotifyAuthentication = async () => {
    try {
      const response = await fetch("/spotify/is-authenticated");
      const data = await response.json();
      setIsSpotifyAuthenticated(data.status);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Authenticates the user with Spotify.
   *
   * - Checks if the user is already authenticated.
   * - If not authenticated, performs the necessary steps to redirect the user to Spotify's authentication page.
   * - After authentication, the user will be redirected back to the application.
   */
  const authenticateSpotifyUser = async () => {
    try {
      checkSpotifyAuthentication();
      if (!isSpotifyAuthenticated) {
        const response = await fetch("/spotify/auth-redirection");
        const data = await response.json();
        window.location.replace(data.url);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getBoxDetails = async () => {
    try {
      const response = await fetch("/box-management/get-box?name=" + boxName);
      if (!response.ok) {
        navigate("/");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleButtonClick = () => {
    // console.log("Connect button clicked!");
    authenticateSpotifyUser();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: "linear-gradient(to right, #F59225, #F8431D)",
      }}
    >
      <Menu />
      <Button variant="contained" onClick={handleButtonClick}>
        Connect
      </Button>
      <LiveSearch
        isSpotifyAuthenticated={isSpotifyAuthenticated}
        checkSpotifyAuthentication={checkSpotifyAuthentication}
      />
      <div>
        <h3>{boxName}</h3>
      </div>
    </Box>
  );
}
