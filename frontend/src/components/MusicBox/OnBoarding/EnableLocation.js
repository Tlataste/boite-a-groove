import React, { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { checkLocation } from "../BoxUtils";
import CircularProgress from "@mui/material/CircularProgress";

export default function EnableLocation({ setStage, boxInfo, navigate }) {
  // States & Variables

  const [isButtonClicked, setIsButtonClicked] = useState(false);

  function handleButtonClick() {
    setIsButtonClicked(true);
    checkLocation(boxInfo, navigate).then(() => setStage(2));
  }

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
              <Typography variant="h5">{boxInfo.box.name}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6">Autoriser la localisation</Typography>
              <Typography variant="subtitle1">
                Confirme que tu es bien à l'arrêt en partageant ta localisation.
                Ta localisation est uniquement utilisée à l'ouverture d'une
                boîte.
              </Typography>
            </Grid>
            <Grid item>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={handleButtonClick}
                    sx={{
                      borderRadius: "20px",
                      backgroundImage:
                        "linear-gradient(to right, #fa9500, #fa4000)",
                      color: "white",
                      border: "none",
                      textTransform: "none",
                      "&:hover": {
                        border: "none",
                      },
                    }}
                  >
                    Autoriser
                  </Button>
                </Grid>
                {isButtonClicked && (
                  <Grid item>
                    <CircularProgress
                      size={24}
                      sx={{
                        color: "#fa9500",
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
