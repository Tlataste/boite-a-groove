import React, { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function BoxStartup({ setStage, boxInfo }) {
  return (
    <>
      {boxInfo && Object.keys(boxInfo.box || {}).length > 0 ? (
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
              <Typography variant="h6">{boxInfo.box.name}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">
                {boxInfo.deposit_count} chansons sur cet arrêt échanges-en une
                pour la découvrir
              </Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={() => setStage(1)}>
                Commencer
              </Button>
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
