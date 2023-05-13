import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "./Menu";

export default function HomePage() {
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);

  const handleButtonClick = () => {
    console.log("Connect button clicked!");
    authenticateSpotify();
  };

  function authenticateSpotify() {
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
  }

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
    </Box>
  );
}
