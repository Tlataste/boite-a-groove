import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";

export default function LiveSearch({
  isSpotifyAuthenticated,
  checkSpotifyAuthentication,
}) {
  const [searchValue, setSearchValue] = useState("");
  const [jsonResults, setJsonResults] = useState([]);

  /**
   * useEffect hook that executes when the component mounts or when the 'searchValue' or 'isSpotifyAuthenticated' dependencies change.
   *
   * - Retrieves data based on certain conditions:
   *   - If 'searchValue' is empty and the user is authenticated with Spotify, fetches recent tracks.
   *   - If 'searchValue' is not empty, performs a search using the 'searchValue'.
   * - Sets the retrieved data to the 'jsonResults' state variable.
   * - Clears the timeout when the component unmounts or when the 'searchValue' or 'isSpotifyAuthenticated' dependencies change.
   */
  useEffect(() => {
    const getData = setTimeout(() => {
      checkSpotifyAuthentication();
      console.log(isSpotifyAuthenticated);
      if (searchValue === "" && isSpotifyAuthenticated) {
        fetch("/spotify/recent-tracks")
          .then((response) => response.json())
          .then((data) => {
            setJsonResults(data);
            console.log(data);
          });
      } else if (searchValue != "") {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            search_query: searchValue,
          }),
        };

        fetch("/spotify/search", requestOptions)
          .then((response) => response.json())
          .then((data) => {
            setJsonResults(data);
            console.log(data);
          });
      }
    }, 400);

    return () => clearTimeout(getData);
  }, [searchValue, isSpotifyAuthenticated]);

  return (
    <Stack sx={{ width: 300, margin: "auto" }}>
      <Autocomplete
        options={jsonResults}
        getOptionLabel={(option) => `${option.name}`}
        sx={{ width: 300 }}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        noOptionsText={"No songs available"}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id}>
            {option.name}
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
