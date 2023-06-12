import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { logoutUser } from "./UsersUtils";
import {checkDeezerAuthentication,
    authenticateDeezerUser,
disconnectDeezerUser} from "./MusicBox/DeezerUtils";
import {
    checkSpotifyAuthentication,
    authenticateSpotifyUser,
    disconnectSpotifyUser,
} from "./MusicBox/SpotifyUtils";

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
    marginBottom: "16px",
  },
  buttonConnect: {
    backgroundColor: "transparent",
    border: "1px solid gray",
    color: "gray",
  },
  buttonPlatform: {
    backgroundColor: "transparent",
    color: "gray",
    textTransform: "none",
    fontStyle: "italic",
  },
  image: {
    width: "80px",
    height: "20px",
    marginRight: "8px",
  },
  streamingTitle: {
    marginTop: "24px",
    marginBottom: "24px",
  },
};

export default function UserProfilePage() {
  const [password, setPassword] = useState("********");
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false);
  const [isDeezerAuthenticated, setIsDeezerAuthenticated] = useState(false);
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(
    UserContext
  );
  const navigate = useNavigate();
 useEffect(() => {
    checkSpotifyAuthentication(setIsSpotifyAuthenticated);
    checkDeezerAuthentication(setIsDeezerAuthenticated);
    }, []);
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
    const handleButtonClickConnectSpotify = () => {
        authenticateSpotifyUser(isSpotifyAuthenticated, setIsSpotifyAuthenticated);
    };
    const handleButtonClickDisconnectSpotify = () => {
        disconnectSpotifyUser(isSpotifyAuthenticated, setIsSpotifyAuthenticated);
        window.location.reload();
    };
    const handleButtonClickConnectDeezer = () => {
    authenticateDeezerUser(isDeezerAuthenticated, setIsDeezerAuthenticated);
  };
    const handleButtonClickDisconnectDeezer = () => {
    disconnectDeezerUser(isDeezerAuthenticated, setIsDeezerAuthenticated);
    window.location.reload();
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

      <Typography variant="h6" gutterBottom style={styles.streamingTitle}>
        Tes services de streaming
      </Typography>

      <Grid container spacing={2} alignItems="center" style={styles.buttonGroup}>
        <Grid item>
            {isSpotifyAuthenticated ? (
          <Button variant="contained" style={styles.buttonPlatform} onClick={handleButtonClickDisconnectSpotify}>
            <img src="../static/images/spotify_logo.svg" alt="Spotify" style={styles.buttonImage} />
            Se déconnecter
          </Button>
            ) : (
                <Button variant="contained" style={styles.buttonPlatform} onClick={handleButtonClickConnectSpotify}>
                    <img src="../static/images/spotify_logo.svg" alt="Spotify" style={styles.buttonImage} />
                    Se connecter
                </Button>
            )}
        </Grid>
        <Grid item>
         {isDeezerAuthenticated ? (
          <Button variant="contained" style={styles.buttonPlatform} onClick={handleButtonClickDisconnectDeezer}>
            <img src="../static/images/deezer_logo.svg" alt="Deezer" style={styles.buttonImage} />
            Se déconnecter
          </Button>
            ) : (
                <Button variant="contained" style={styles.buttonPlatform} onClick={handleButtonClickConnectDeezer}>
                    <img src="../static/images/deezer_logo.svg" alt="Deezer" style={styles.buttonImage} />
                    Se connecter
                </Button>
            )}
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
