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
import {
    checkDeezerAuthentication,
    authenticateDeezerUser, } from "./DeezerUtils";
import { getBoxDetails } from "./BoxUtils";
import SongCard from "./SongCard";

export default function MusicBox() {
  // States & Variables
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false);
  const [isDeezerAuthenticated, setIsDeezerAuthenticated] = useState(false);
  let [streamingService] = useState("spotify");
  const [deposits, setDeposits] = useState([]);
  const [isDeposited, setIsDeposited] = useState(false);
  const { boxName } = useParams();
  const navigate = useNavigate();

  /**
   * Function to be executed when the component is mounted and the page is loaded
   * Check at page load (only) if user is authenticated with spotify and get the box's last deposits.
   */
  useEffect(() => {
    checkSpotifyAuthentication(setIsSpotifyAuthenticated);
    checkDeezerAuthentication(setIsDeezerAuthenticated);
    getBoxDetails(boxName, navigate)
      .then((data) => {
        setDeposits(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); // Empty dependency array ensures the effect is only run once

  const handleButtonClickSpotify = () => {
    authenticateSpotifyUser(isSpotifyAuthenticated, setIsSpotifyAuthenticated);
  };

  const handleButtonClickDeezer = () => {
    authenticateDeezerUser(isDeezerAuthenticated, setIsDeezerAuthenticated);
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
      <Menu boxName={boxName} />
      <Button variant="contained" onClick={handleButtonClickSpotify}>
        Connect Spotify
      </Button>
        <Button variant="contained" onClick={handleButtonClickDeezer}>
        Connect Deezer
        </Button>
      <SongCard deposits={deposits} isDeposited={isDeposited} />
      <LiveSearch
        isSpotifyAuthenticated={isSpotifyAuthenticated}
        isDeezerAuthenticated={isDeezerAuthenticated}
        boxName={boxName}
        setIsDeposited={setIsDeposited}
        streamingService={streamingService}
      />
    </Box>
  );
}
