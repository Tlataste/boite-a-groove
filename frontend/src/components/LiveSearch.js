import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";

export default function LiveSearch() {
  const [searchValue, setSearchValue] = useState("");
  const [jsonResults, setJsonResults] = useState([]);

  useEffect(() => {
    const getData = setTimeout(() => {
      if (searchValue === "")
      {
        const requestOptions = {
          method: "POST"
        };

        fetch("/spotify/recent-tracks", requestOptions)
          .then((response) => response.json())
          .then((data) => {
            setJsonResults(data);
            console.log(data);
          });
      }
      else
      {
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
  }, [searchValue]);

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
