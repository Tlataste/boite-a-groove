import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";

export default function LiveSearch() {
  const [searchValue, setSearchValue] = useState("");
  const [jsonResults, setJsonResults] = useState([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetch(`https://www.balldontlie.io/api/v1/players?search=${searchValue}`)
        .then((response) => response.json())
        .then((json) => setJsonResults(json.data));
    }, 2000);
    console.log(jsonResults);

    return () => clearTimeout(delayDebounceFn);
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
