import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { logoutUser } from "./UsersUtils";

const styles = {
  root: {
    flexGrow: 1,
    padding: "16px",
  },
  avatar: {
    width: "80px",
    height: "80px",
  },
  textField: {
    marginBottom: "16px",
  },
  buttonGroup: {
    marginTop: "16px",
    marginBottom: "16px",
  },
};

export default function UserProfilePage() {
  const [password, setPassword] = useState("********");
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(
    UserContext
  );
  const navigate = useNavigate();

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  if (!isAuthenticated) {
    return null; // or render a different component or message
  }

  return (
    <div style={styles.root}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar
            style={styles.avatar}
            src="/path/to/profile-image.jpg"
            alt="User Avatar"
          />
        </Grid>
        <Grid item>
          <Typography variant="h5">{user.username}</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center" style={styles.buttonGroup}>
        <Grid item>
          <Button variant="contained">Se connecter à Spotify</Button>
        </Grid>
        <Grid item>
          <Button variant="contained">Se connecter à Deezer</Button>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Informations personnelles
      </Typography>
      <TextField
        style={styles.textField}
        label="Email"
        variant="outlined"
        fullWidth
        value={user.email}
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        style={styles.textField}
        label="Password"
        variant="outlined"
        fullWidth
        type="password"
        value={password}
        onChange={handlePasswordChange}
      />
      <Button
        variant="contained"
        onClick={() => logoutUser(setUser, setIsAuthenticated)}
      >
        Déconnexion
      </Button>
    </div>
  );
}
