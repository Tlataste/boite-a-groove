import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import Box from "@mui/material/Box";
import MenuAppBar from "../Menu";
import LiveSearch from "./LiveSearch";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { checkSpotifyAuthentication } from "./SpotifyUtils";
import { checkDeezerAuthentication } from "./DeezerUtils";
import { getBoxDetails } from "./BoxUtils";
import SongCard from "./SongCard";
import BoxStartup from "./OnBoarding/BoxStartup";
import EnableLocation from "./OnBoarding/EnableLocation";
import SongDisplay from "./OnBoarding/SongDisplay";

export default function MusicBox() {
  // States & Variables
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false);
  const [isDeezerAuthenticated, setIsDeezerAuthenticated] = useState(false);

  const [stage, setStage] = useState(0);
  const navigate = useNavigate();

  // Gets box name from URL
  const { boxName } = useParams();
  // Stores all the information about the box
  const [boxInfo, setBoxInfo] = useState({});
  // Checks if a song has been deposited in the box
  const [isDeposited, setIsDeposited] = useState(false);
  // User Context variables
  const { setCurrentBoxName, user } = useContext(UserContext);

  const [dispSong, setDispSong] = useState({});

  const [searchSong, setSearchSong] = useState({});

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
    <>
      <MenuAppBar />
      <Box sx={{ backgroundColor: "#e0e0e0", minHeight: "100vh" }}>
        {stage === 0 && <BoxStartup setStage={setStage} boxInfo={boxInfo} />}
        {stage === 1 && (
          <EnableLocation
            setStage={setStage}
            boxInfo={boxInfo}
            navigate={navigate}
          />
        )}
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
              setStage={setStage}
              setSearchSong={setSearchSong}
            />
          </>
        )}
        {stage === 3 && (
            <>
              <SongCard
              deposits={boxInfo.last_deposits}
              isDeposited={isDeposited}
              setStage={setStage}
              setDispSong={setDispSong}
              searchSong = {searchSong}
            />
            </>
        )}
        {stage === 4 && (
            <>
              <SongDisplay
              dispSong = {dispSong}
            />
            </>
        )}
      </Box>
    </>
  );
}
