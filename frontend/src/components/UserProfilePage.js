import React, { useState, useEffect, useContext } from "react";
import MenuAppBar from "./Menu";
import { UserContext } from "./UserContext";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { logoutUser } from "./UsersUtils";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import { getCookie } from "./Security/TokensUtils";
import { checkUserStatus, setPreferredPlatform } from "./UsersUtils";
import {
  checkDeezerAuthentication,
  authenticateDeezerUser,
  disconnectDeezerUser,
} from "./MusicBox/DeezerUtils";
import {
  checkSpotifyAuthentication,
  authenticateSpotifyUser,
  disconnectSpotifyUser,
} from "./MusicBox/SpotifyUtils";

// Styles
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
    color: "gray",
  },
  buttonPlatform: {
    backgroundColor: "transparent",
    color: "gray",
    textTransform: "none",
    fontStyle: "italic",
  },
  image: {
    width: "100px",
    height: "50px",
    marginRight: "8px",
  },
  streamingTitle: {
    marginTop: "24px",
  },
  avatarContainer: {
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    top: "15px",
    right: "0px",
  },
};

export default function UserProfilePage() {
  // States & Variables
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false);
  const [isDeezerAuthenticated, setIsDeezerAuthenticated] = useState(false);

  const { user, setUser, setIsAuthenticated } = useContext(UserContext);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  /**
   * Runs the specified callback function after the component has rendered.
   */
  useEffect(() => {
    checkSpotifyAuthentication(setIsSpotifyAuthenticated);
    checkDeezerAuthentication(setIsDeezerAuthenticated);
  }, []);

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

  const handlePasswordChange = () => {
    setShowPasswordForm(true);
  };

  const handlePasswordCancel = () => {
    setShowPasswordForm(false);
  };

  /**
   * Sends a password change request to the server and processes the response.
   *
   * @param {FormData} form - The form data containing the password change details.
   * @returns {Promise<void>} - A Promise that resolves when the request is completed.
   */
  const sendAndProcessPasswordChange = async (form) => {
    const csrftoken = getCookie("csrftoken");
    const requestOptions = {
      method: "POST",
      headers: { "X-CSRFToken": csrftoken },
      body: form,
    };
    try {
      const response = await fetch("/users/change-password", requestOptions);
      const data = await response.json();
      if (response.ok) {
        setErrorMessages({});
        setShowPasswordForm(false);
        console.log("Password changed successfuly");
      } else {
        if (data.errors) {
          // console.log(data.errors);
          setErrorMessages(data.errors);
        } else {
          console.log(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Handles the form submission event for password change.
   *
   * @param {Event} event - The form submission event.
   * @returns {void}
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    sendAndProcessPasswordChange(data);
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // console.log(file);
      const form = new FormData();
      form.append("profile_picture", file);
      const csrftoken = getCookie("csrftoken");
      const requestOptions = {
        method: "POST",
        headers: { "X-CSRFToken": csrftoken },
        body: form,
      };
      try {
        const response = await fetch(
          "/users/change-profile-pic",
          requestOptions
        );
        const data = await response.json();
        if (response.ok) {
          checkUserStatus(setUser, setIsAuthenticated);
          console.log("Profile picture changed successfuly");
        } else {
          if (data.errors) {
            console.log(data.errors);
          } else {
            console.log(data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  function handlePreferredPlatform(platform) {
    setPreferredPlatform(platform)
      .then(() => {
        checkUserStatus(setUser, setIsAuthenticated);
      })
      .catch(() => {
        console.log("cannot change preferred platform");
      });
  }

  return (
    <>
      <MenuAppBar />
      <div style={styles.root}>
        <Grid container spacing={2} alignItems="center">
          <Grid item style={styles.avatarContainer}>
            <input
              accept="image/*"
              id="avatar-input"
              type="file"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-input">
              <Avatar
                style={styles.avatar}
                src={user.profile_picture_url}
                alt="User Avatar"
                component="span"
              />
              <EditIcon style={styles.editIcon} />
            </label>
          </Grid>
          <Grid item>
            <Typography variant="h5">{user.username}</Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Tes informations personnelles
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              style={styles.textField}
              label="Mot de passe"
              variant="outlined"
              fullWidth
              type="password"
              value="*******"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
        {showPasswordForm ? (
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="old_password"
                  label="Ancien mot de passe"
                  type="password"
                  id="oldPassword"
                  autoComplete="current-password"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="new_password1"
                  label="Nouveau mot de passe"
                  type="password"
                  id="newPassword1"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="new_password2"
                  label="Confirmation du mot de passe"
                  type="password"
                  id="newPassword2"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" sx={{ mt: 3 }}>
              Modifier
            </Button>
            <Button
              variant="contained"
              sx={{ ml: 3, mt: 3 }}
              onClick={handlePasswordCancel}
            >
              Annuler
            </Button>
            {Object.keys(errorMessages).map((key) => (
              <Typography
                key={key}
                variant="body2"
                color="error"
                align="center"
              >
                {errorMessages[key]}
              </Typography>
            ))}
          </Box>
        ) : (
          <Button variant="contained" onClick={handlePasswordChange}>
            Modifier le mot de passe
          </Button>
        )}

        <Grid
          container
          spacing={2}
          alignItems="center"
          style={styles.buttonGroup}
        >
          <Grid item>
            <>
              <Typography variant="h6" style={styles.streamingTitle}>
                Tes services de streaming
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Ta plateforme principale est celle utilisée pour la recherche
              </Typography>
            </>
          </Grid>

          <Grid
            container
            spacing={2}
            alignItems="center"
            style={styles.buttonGroup}
          >
            <Grid item>
              <img
                src="../static/images/spotify_logo.svg"
                alt="Spotify"
                style={styles.image}
              />
            </Grid>
            <Grid item>
              {isSpotifyAuthenticated ? (
                <Button
                  variant="contained"
                  style={styles.buttonConnect}
                  onClick={handleButtonClickDisconnectSpotify}
                >
                  Se déconnecter
                </Button>
              ) : (
                <Button
                  variant="contained"
                  style={styles.buttonConnect}
                  onClick={handleButtonClickConnectSpotify}
                >
                  Se connecter
                </Button>
              )}
            </Grid>
            <Grid item>
              {user.preferred_platform === "spotify" ? (
                <Typography variant="subtitle1">
                  Plateforme principale
                </Typography>
              ) : (
                <Button
                  variant="contained"
                  style={styles.buttonPlatform}
                  onClick={() => handlePreferredPlatform("spotify")}
                >
                  Choisir comme plateforme principale
                </Button>
              )}
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            alignItems="center"
            style={styles.buttonGroup}
          >
            <Grid item>
              <img
                src="../static/images/deezer_logo.svg"
                alt="Deezer"
                style={styles.image}
              />
            </Grid>
            <Grid item>
              {isDeezerAuthenticated ? (
                <Button
                  variant="contained"
                  style={styles.buttonConnect}
                  onClick={handleButtonClickDisconnectDeezer}
                >
                  Se déconnecter
                </Button>
              ) : (
                <Button
                  variant="contained"
                  style={styles.buttonConnect}
                  onClick={handleButtonClickConnectDeezer}
                >
                  Se connecter
                </Button>
              )}
            </Grid>
            <Grid item>
              {user.preferred_platform === "deezer" ? (
                <Typography variant="subtitle1">
                  Plateforme principale
                </Typography>
              ) : (
                <Button
                  variant="contained"
                  style={styles.buttonPlatform}
                  onClick={() => handlePreferredPlatform("deezer")}
                >
                  Choisir comme plateforme principale
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          onClick={() => logoutUser(setUser, setIsAuthenticated)}
        >
          Déconnexion
        </Button>
      </div>
    </>
  );
}
