import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "../Menu";
import LiveSearch from "./LiveSearch";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { checkSpotifyAuthentication } from "./SpotifyUtils";
import { checkDeezerAuthentication } from "./DeezerUtils";
import { getBoxDetails } from "./BoxUtils";
import SongCard from "./SongCard";
import BoxStartup from "./OnBoarding/BoxStartup";
import EnableLocation from "./OnBoarding/EnableLocation";

export default function MusicBox() {
  // States & Variables
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false);
  const [isDeezerAuthenticated, setIsDeezerAuthenticated] = useState(false);

  const [stage, setStage] = useState(0);
  const navigate = useNavigate();

  const { boxName } = useParams();
  const [boxInfo, setBoxInfo] = useState({});
  const [isDeposited, setIsDeposited] = useState(false);
  const { setCurrentBoxName, user } = useContext(UserContext);

  /**
   * Function to be executed when the component is mounted and the page is loaded
   * Check at page load (only) if user is authenticated with spotify and get the box's details
   */
  useEffect(() => {
    checkSpotifyAuthentication(setIsSpotifyAuthenticated);
    checkDeezerAuthentication(setIsDeezerAuthenticated);
    setCurrentBoxName(boxName);
    getBoxDetails(boxName, navigate)
      .then((data) => {
        setBoxInfo(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); // Empty dependency array ensures the effect is only run once

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
      {stage === 0 && <BoxStartup setStage={setStage} boxInfo={boxInfo} />}
      {stage === 1 && <EnableLocation setStage={setStage} />}
      {stage === 2 && (
        <>
          <SongCard
            deposits={boxInfo.last_deposits}
            isDeposited={isDeposited}
          />
          <LiveSearch
            isSpotifyAuthenticated={isSpotifyAuthenticated}
            isDeezerAuthenticated={isDeezerAuthenticated}
            boxName={boxName}
            setIsDeposited={setIsDeposited}
            user={user}
          />
        </>
      )}
    </Box>
  );
}
