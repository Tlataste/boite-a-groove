import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "./Menu";
import LiveSearch from "./LiveSearch";

export default function HomePage() {
  // States
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState({});

  const authenticateSpotifyUser = async () => {
    try {
      const response = await fetch("/spotify/is-authenticated");
      // console.log(response.ok);
      const data = await response.json();
      setSpotifyAuthenticated(data.status);
      console.log("Authenticated ?" + spotifyAuthenticated);
      if (!data.status) {
        const response = await fetch("/spotify/auth-redirection");
        const data = await response.json();
        window.location.replace(data.url);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getRecentlyPlayedTracks = async () => {
    try {
      const response = await fetch("/spotify/get-recently-played-tracks");
      if (!response.ok) {
        return {};
      } else {
        const data = await response.json();
        setRecentlyPlayedTracks(data);
        console.log(recentlyPlayedTracks);
        return data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleButtonClick = () => {
    console.log("Connect button clicked!");
    authenticateSpotifyUser();
    // getRecentlyPlayedTracks();
  };

  /* function authenticateSpotify() {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setSpotifyAuthenticated(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  } */

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
      <LiveSearch />
    </Box>
  );
}
