import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "../Menu";
import LiveSearch from "./LiveSearch";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  checkSpotifyAuthentication,
  authenticateSpotifyUser,
} from "./SpotifyUtils";
import { getBoxDetails } from "./BoxUtils";

export default function MusicBox() {
  // States & Variables
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false);
  const { boxName } = useParams();
  const navigate = useNavigate();

  /**
   * Function to be executed when the component is mounted and the page is loaded
   * Check on page load (only) if the user is authenticated with spotify
   */
  useEffect(() => {
    checkSpotifyAuthentication(setIsSpotifyAuthenticated);
    getBoxDetails(boxName, navigate);
  }, []); // Empty dependency array ensures the effect is only run once

  const handleButtonClick = () => {
    // console.log("Connect button clicked!");
    authenticateSpotifyUser(isSpotifyAuthenticated, setIsSpotifyAuthenticated);
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
      <LiveSearch isSpotifyAuthenticated={isSpotifyAuthenticated}
       boxName = {boxName}/>
      <div>
        <h3>{boxName}</h3>
      </div>
    </Box>
  );
}