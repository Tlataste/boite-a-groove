import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";

export default function LiveSearch() {
  const [jsonResults, setJsonResults] = useState([]);

  // Only run once thansk to []
  useEffect(() => {
    fetch("https://www.balldontlie.io/api/v1/players") // Select the API to fetch
      .then((response) => response.json())
      .then((json) => setJsonResults(json.data)); // Set the result in jsonResults
  }, []);
  console.log(jsonResults);

  return (
    <Stack sx={{ width: 300, margin: "auto" }}>
      <Autocomplete
        options={jsonResults} // Options for the autocomplete = content
        getOptionLabel={(
          jsonResults // Defines how to extract the label for each option
        ) => `${jsonResults.first_name} ${jsonResults.last_name}`}
        sx={{ width: 300 }} // Styling
        isOptionEqualToValue={(
          // Compares the option with the selected value.
          option,
          value
        ) => option.first_name === value.first_name}
        noOptionsText={"No songs availaible"}
        renderOption={(
          props,
          jsonResults // Renders each option
        ) => (
          <Box component="li" {...props} key={jsonResults.id}>
            {jsonResults.first_name} {jsonResults.last_name}
          </Box>
        )}
        renderInput={(
          params // Renders the input field for the autocomplete
        ) => <TextField {...params} label="Search for a song" />}
      />
    </Stack>
  );
}
