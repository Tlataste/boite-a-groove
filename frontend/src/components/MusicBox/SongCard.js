import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { getCookie } from "../Security/TokensUtils";

/**
 * SongCard Component
 * Displays a card representing a song with its title, artist, and album cover image.
 * @param {Object} deposits - An object containing song deposit data.
 * @param {boolean} isDeposited - A boolean indicating whether the song has been deposited.
 * @param setStage - A function used to set the stage of the page
 * @param setDispSong - A function used to set the song that we will display
 * @param searchSong
 * @returns {JSX.Element} - JSX element representing the SongCard component.
 */
export default function SongCard({
  deposits,
  isDeposited,
  setStage,
  setDispSong,
  searchSong,
  setDepositedBy,
}) {
  // States
  const [depositIndex, setdepositIndex] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState("spotify");
  /**
   * Handles the click event for the "Next" button.
   * Increments the depositIndex if it is less than 1.
   */
  function next() {
    if (depositIndex < deposits.last_deposits_songs.length - 1) {
      setdepositIndex(depositIndex + 1);
    }
  }

  /**
   * Handles the click event for the "Previous" button.
   * Decrements the depositIndex if it is greater than 0.
   */
  function prev() {
    if (depositIndex > 0) {
      setdepositIndex(depositIndex - 1);
    }
  }

  function replaceVisibleDeposit() {
    const csrftoken = getCookie("csrftoken");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
      body: JSON.stringify({
        visible_deposit: deposits.last_deposits[depositIndex],
        search_deposit: searchSong,
      }),
    };
    //console.log(requestOptions.body);

    fetch("../box-management/replace-visible-deposits", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .then(() => setDispSong(deposits.last_deposits_songs[depositIndex]))
      .then(() => setDepositedBy(deposits.last_deposits[depositIndex].user))
      .then(() => setStage(4));

    fetch("../box-management/discovered-songs", requestOptions);
  }

  return (
    <>
      {Object.keys(deposits.last_deposits_songs).length > 0 ? (
        <Card
          sx={{
            display: "flex",
            margin: "auto",
            maxWidth: "fit-content",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", width: 200 }}>
            <CardContent sx={{ flex: "1 0 auto" }}></CardContent>
            <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
              <IconButton aria-label="previous" onClick={prev}>
                <NavigateBeforeIcon sx={{ height: 38, width: 38 }} />
              </IconButton>
              <IconButton aria-label="next" onClick={next}>
                <NavigateNextIcon sx={{ height: 38, width: 38 }} />
              </IconButton>
            </Box>
            <Box
              sx={{
                flex: "1 0 auto",
                display: "flex",
                alignItems: "center",
                pl: 1,
                pb: 1,
              }}
            ></Box>
            <Box sx={{ flex: "1 0 auto" }}>
              <button
                onClick={() => {
                  replaceVisibleDeposit();
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Révéler
              </button>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CardMedia
              component="img"
              sx={{ width: 150 }}
              image={deposits.last_deposits_songs[depositIndex].image_url}
              alt="Track cover"
            />
          </Box>
        </Card>
      ) : (
        // Display a loading indicator when deposits is null or empty
        <div>Loading...</div>
      )}
    </>
  );
}
