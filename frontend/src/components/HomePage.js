import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "./Menu";
import LiveSearch from "./LiveSearch";

export default function HomePage() {
  // States
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false);

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
    </Box>
  );
}
