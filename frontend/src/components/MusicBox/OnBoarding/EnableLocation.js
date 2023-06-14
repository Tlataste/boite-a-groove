import React, { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function EnableLocation({ setStage }) {
  // States & Variables

  function handleButtonClick() {
    setStage(2);
  }

  return (
    <Paper
      elevation={3}
      sx={{
        background: "white",
        height: "100%",
        padding: "10px",
      }}
    >
      <Grid
        container
        item
        spacing={2}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h5">Nom boîte</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6">Autoriser la localisation</Typography>
          <Typography variant="subtitle1">
            Confirme que tu est bien à l'arrêt en partageant ta localisation. Ta
            localisation est uniquement utilisée à l'ouverture d'une boîte
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleButtonClick}>
            Autoriser
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
