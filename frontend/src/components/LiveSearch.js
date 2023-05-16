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
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search_query: searchValue,
        }),
      };

      fetch("/spotify/search", requestOptions)
        .then((response) => response.json())
        .then((json) => setJsonResults(json.data));
      console.log("requête");
    }, 2000);

    return () => clearTimeout(getData);
  }, [searchValue]);

  return (
    <Stack sx={{ width: 300, margin: "auto" }}>
      <Autocomplete
        freeSolo
        options={jsonResults}
        getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
        sx={{ width: 300 }}
        isOptionEqualToValue={(option, value) =>
          option.first_name === value.first_name
        }
        noOptionsText={"No songs available"}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id}>
            {option.first_name} {option.last_name}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search for a player"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        )}
      />
    </Stack>
  );
}
