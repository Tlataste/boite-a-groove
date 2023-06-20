import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { getCookie } from "../../Security/TokensUtils";


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
export default function SongDisplay({dispSong}) {
  // States
  const [selectedProvider, setSelectedProvider] = useState("spotify");
  /**
   * Handles the click event for the "Go to link" button.
   */
  function redirectToLink() {
    const csrftoken = getCookie("csrftoken");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
      body: JSON.stringify({
        song: dispSong,
        platform: selectedProvider,
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
        <Card
          sx={{
            display: "flex",
            margin: "auto",
            maxWidth: "fit-content",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", width: 200 }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography component="div" variant="h5">
                {dispSong.title}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                {dispSong.artist}
              </Typography>
            </CardContent>
            <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>

            </Box>
            <Box sx={{ flex: "1 0 auto", display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
              <select value={selectedProvider} onChange={handleProviderChange}>
                <option value="spotify">
                  Spotify
                </option>
                <option value="deezer">
                  Deezer
                </option>
              </select>
              </Box>
              <Box sx={{ flex: "1 0 auto" }}>
                <button
                  onClick={() => {redirectToLink()}}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Aller vers ...
                </button>
              </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>

              <CardMedia
                component="img"
                sx={{ width: 150 }}
                image={dispSong.image_url}
                alt="Track cover"
              />
          </Box>
        </Card>)
}
