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
    <Box
      sx={{
        flexGrow: 1,
        background: "linear-gradient(to right, #fa9227, #fb451f)",
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: "transparent" }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" component="div">
              La Boîte à Groove
            </Typography>
            {isAuthenticated ? (
              <Typography variant="subtitle1" component="div">
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
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <LockOpenIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={Link} to="/login" onClick={handleClose}>
                  Se connecter
                </MenuItem>
                <MenuItem component={Link} to="/register" onClick={handleClose}>
                  S'enregistrer
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
