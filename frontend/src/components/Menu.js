import * as React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PersonIcon from "@mui/icons-material/Person";
import Button from "@mui/material/Button";

export default function MenuAppBar() {
  // States & Variables
  const { user, setUser, isAuthenticated, setIsAuthenticated } =
    useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar position="static" sx={{ backgroundColor: "white" }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                backgroundImage: "linear-gradient(to right, #fa9500, #fa4000)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              La Boîte à Groove
            </Typography>
          </a>
          {isAuthenticated ? (
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ color: "black" }}
            >
              Bienvenue {user.username}
            </Typography>
          ) : (
            <></>
          )}
        </Box>
        {isAuthenticated ? (
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            color="inherit"
            component={Link}
            to="/profile"
          >
            <Avatar alt={user.username} src={user.profile_picture_url} />
          </IconButton>
        ) : (
          <Button
            variant="outlined"
            endIcon={<PersonIcon />}
            component={Link}
            to="/login"
            sx={{
              borderRadius: "20px",
              backgroundColor: "white",
              color: "orange",
              border: "none",
              textTransform: "none",
              "&:hover": {
                border: "none",
              },
            }}
          >
            Me connecter
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
