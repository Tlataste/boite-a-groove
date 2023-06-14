import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { getCookie } from "../Security/TokensUtils";

const spotifyLogo = "spotify-logo.png"; // Remplacez par le chemin d'accès à votre logo Spotify
const deezerLogo = "deezer-logo.png"; // Remplacez par le chemin d'accès à votre logo Deezer

/**
 * SongCard Component
 * Displays a card representing a song with its title, artist, and album cover image.
 * @param {Object} deposits - An object containing song deposit data.
 * @param {boolean} isDeposited - A boolean indicating whether the song has been deposited.
 * @returns {JSX.Element} - JSX element representing the SongCard component.
 */
export default function SongCard({ deposits, isDeposited }) {
  // States
  const [depositIndex, setdepositIndex] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState("spotify");

  /**
   * Handles the click event for the "Next" button.
   * Increments the depositIndex if it is less than 1.
   */
  function next() {
    if (depositIndex < 1) {
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

  /**
   * Handles the click event for the "Go to link" button.
   */
  function redirectToLink() {
    const csrftoken = getCookie("csrftoken");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
      body: JSON.stringify({
        song: deposits[depositIndex],
      }),
    };

    fetch("../api_agg/aggreg", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.open(data);
      });
  }

  /**
   * Handles the change event for the provider selection dropdown.
   * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event object.
   */
  function handleProviderChange(event) {
    setSelectedProvider(event.target.value);
  }

  return (
    <>
      {Object.keys(deposits).length > 0 ? (
        <Card
          sx={{
            display: "flex",
            margin: "auto",
            maxWidth: "fit-content",
            filter: isDeposited ? "none" : "blur(4px)",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", width: 200 }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography component="div" variant="h5">
                {deposits[depositIndex].title}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                {deposits[depositIndex].artist}
              </Typography>
            </CardContent>
            <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
              <IconButton aria-label="previous" onClick={prev}>
                <NavigateBeforeIcon sx={{ height: 38, width: 38 }} />
              </IconButton>
              <IconButton aria-label="next" onClick={next}>
                <NavigateNextIcon sx={{ height: 38, width: 38 }} />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <select value={selectedProvider} onChange={handleProviderChange}>
              <option value="spotify">
                <img
                  src={spotifyLogo}
                  alt="Spotify"
                  style={{ width: "20px", height: "20px", marginRight: "5px" }}
                />
                Spotify
              </option>
              <option value="deezer">
                <img
                  src={deezerLogo}
                  alt="Deezer"
                  style={{ width: "20px", height: "20px", marginRight: "5px" }}
                />
                Deezer
              </option>
            </select>
            <button
              onClick={redirectToLink}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              <CardMedia
                component="img"
                sx={{ width: 150 }}
                image={deposits[depositIndex].image_url}
                alt="Track cover"
              />
            </button>
          </Box>
        </Card>
      ) : (
        // Display a loading indicator when deposits is null or empty
        <div>Loading...</div>
      )}
    </>
  );
}
