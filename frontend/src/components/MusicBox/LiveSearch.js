import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { getCookie } from "../Security/TokensUtils";

export default function LiveSearch({
  isSpotifyAuthenticated,
  isDeezerAuthenticated,
  boxName,
  setIsDeposited,
  user,
  setStage,
  setSearchSong,
}) {
  const [searchValue, setSearchValue] = useState("");
  const [jsonResults, setJsonResults] = useState([]);
  const [selectedStreamingService, setSelectedStreamingService] = useState(
    user.preferred_platform || "spotify"
  );

  /**
   * Updates the selectedStreamingService when the user's preferred_platform changes.
   *
   * @param {function} callback - The function to be executed as the side effect.
   * @param {Array} dependencies - Triggers the callback function when the user's preferred_platform changes.
   */
  useEffect(() => {
    // console.log("here");
    if (user.preferred_platform) {
      setSelectedStreamingService(user.preferred_platform);
    }
  }, [user.preferred_platform]);

  /**
   * useEffect hook that executes when the component mounts or when the 'searchValue' or 'streamingService' dependencies change.
   *
   * - Retrieves data based on certain conditions:
   *   - If 'searchValue' is empty and the user is authenticated with the selected streaming service, fetches recent tracks.
   *   - If 'searchValue' is not empty, performs a search using the 'searchValue'.
   * - Sets the retrieved data to the 'jsonResults' state variable.
   * - Clears the timeout when the component unmounts or when the 'searchValue' or 'streamingService' dependencies change.
   */
  useEffect(() => {
    const getData = setTimeout(() => {
      // console.log("Live search - Auth ? " + isSpotifyAuthenticated);
      // console.log("Live search - Auth ? " + isDeezerAuthenticated);
      if (selectedStreamingService === "spotify") {
        if (searchValue === "") {
          if (isSpotifyAuthenticated) {
            fetch("/spotify/recent-tracks")
              .then((response) => response.json())
              .then((data) => {
                setJsonResults(data);
                // console.log(data);
              });
          } else {
            setJsonResults([]);
          }
        } else {
          const csrftoken = getCookie("csrftoken");
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({
              search_query: searchValue,
            }),
          };

          fetch("/spotify/search", requestOptions)
            .then((response) => response.json())
            .then((data) => {
              setJsonResults(data);
              // console.log(data);
            });
        }
      }

      if (selectedStreamingService === "deezer") {
        if (searchValue === "") {
          if (isDeezerAuthenticated) {
            fetch("/deezer/recent-tracks")
              .then((response) => response.json())
              .then((data) => {
                setJsonResults(data);
                // console.log(data);
              });
          } else {
            setJsonResults([]);
          }
        } else {
          const csrftoken = getCookie("csrftoken");
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({
              search_query: searchValue,
            }),
          };

          fetch("/deezer/search", requestOptions)
            .then((response) => response.json())
            .then((data) => {
              setJsonResults(data);
              // console.log(data);
            });
        }
      }
    }, 400);

    return () => clearTimeout(getData);
  }, [
    searchValue,
    selectedStreamingService,
    isDeezerAuthenticated,
    isSpotifyAuthenticated,
  ]);

  function handleButtonClick(option, boxName) {
    const data = { option, boxName };
    // console.log(option);
    const jsonData = JSON.stringify(data);
    // console.log(jsonData);
    const csrftoken = getCookie("csrftoken");
    fetch("/box-management/get-box?name=" + boxName, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: jsonData,
    })
      .then((response) => response.json())
      .then((data_resp) => {
        //console.log(data_resp);
        //console.log(data_resp.new_deposit);
        setSearchSong(data_resp.new_deposit);
      });
    setIsDeposited(true);
    setStage(3);
  }
  function handleStreamingServiceChange(service) {
    setSelectedStreamingService(service);
  }

  return (
    <Stack sx={{ width: 350, margin: "auto", marginTop: "20px" }}>
      <Box sx={{ marginBottom: "10px" }}>
        <Button
          variant={
            selectedStreamingService === "spotify" ? "contained" : "outlined"
          }
          onClick={() => handleStreamingServiceChange("spotify")}
          sx={{ marginRight: "5px" }}
        >
          Spotify
        </Button>
        <Button
          variant={
            selectedStreamingService === "deezer" ? "contained" : "outlined"
          }
          onClick={() => handleStreamingServiceChange("deezer")}
        >
          Deezer
        </Button>
      </Box>
      <Autocomplete
        options={jsonResults}
        getOptionLabel={(option) => `${option.name}`}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        noOptionsText={
          (!isDeezerAuthenticated &&
            selectedStreamingService === "deezer" &&
            searchValue === "") ||
          (!isSpotifyAuthenticated &&
            selectedStreamingService === "spotify" &&
            searchValue === "")
            ? "Connect to unlock recent tracks!"
            : "No songs available"
        }
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs={3}>
                <img
                  src={option.image_url}
                  alt={option.name}
                  style={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={5}>
                <Box>
                  <Typography variant="h6">{option.name}</Typography>
                  <Typography variant="subtitle2">{option.artist}</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box>
                  <Button
                    variant="contained"
                    onClick={() => handleButtonClick(option, boxName)}
                  >
                    Déposer
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search for a song"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        )}
      />
    </Stack>
  );
}
