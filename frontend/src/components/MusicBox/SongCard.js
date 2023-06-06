import * as React from "react";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

export default function SongCard({ deposits, isDeposited }) {
  const [depositIndex, setdepositIndex] = useState(0);

  const theme = useTheme();

  function next() {
    if (depositIndex < 1) {
      setdepositIndex(depositIndex + 1);
    }
  }

  function prev() {
    if (depositIndex > 0) {
      setdepositIndex(depositIndex - 1);
    }
  }

  return (
    <>
      {Object.keys(deposits).length > 0 ? (
        <Card
          sx={{
            display: "flex",
            margin: "auto",
            maxWidth: "fit-content",
            filter: isDeposited ? "none" : "blur(4px)",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography component="div" variant="h5">
                {deposits[depositIndex].title}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                {deposits[depositIndex].artist}
              </Typography>
            </CardContent>
            <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
              <IconButton aria-label="play/pause" onClick={prev}>
                <NavigateBeforeIcon sx={{ height: 38, width: 38 }} />
              </IconButton>
              <IconButton aria-label="play/pause" onClick={next}>
                <NavigateNextIcon sx={{ height: 38, width: 38 }} />
              </IconButton>
            </Box>
          </Box>
          <CardMedia
            component="img"
            sx={{ width: 151 }}
            image={deposits[depositIndex].image_url}
            alt="Live from space album cover"
          />
        </Card>
      ) : (
        // Afficher un indicateur de chargement ou un message d'erreur lorsque deposits est null ou vide
        <div>Loading...</div> // Par exemple, un message d'indication de chargement
      )}
    </>
  );
}
