import React, { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function BoxStartup({ setStage }) {
  // States & Variables

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
          <Typography variant="h6">Nom boîte</Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            X chansons sur cet arrêt échanges-en une pour la découvrir
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => setStage(1)}>
            Commencer
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
