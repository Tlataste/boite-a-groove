import * as React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import Button from "@mui/material/Button";
import AlbumIcon from "@mui/icons-material/Album";

export default function RedirectToMobile() {
  // States & Variables
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundImage: "linear-gradient(to right, #fa9500, #fa4000)",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          color: "#fff",
          marginBottom: "1rem",
          fontSize: "3rem",
          fontWeight: "bold",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "0.3rem",
        }}
      >
        Impossible d'accéder à la boîte
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ color: "#fff", marginBottom: "2rem" }}
      >
        Vous devez obligatoirement utiliser un smartphone pour accéder à la
        boîte.
      </Typography>
      <Button
        variant="contained"
        sx={{ backgroundColor: "#fa4000", color: "#fff" }}
        onClick={() => {
          navigate("/");
        }}
      >
        Revenir à la page principale
      </Button>
    </Box>
  );
}
