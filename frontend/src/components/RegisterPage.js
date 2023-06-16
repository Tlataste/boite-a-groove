import * as React from "react";
import { useState, useContext } from "react";
import { UserContext } from "./UserContext";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { checkUserStatus } from "./UsersUtils";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { getCookie } from "./Security/TokensUtils";
import { navigateToCurrentBox } from "./MusicBox/BoxUtils";

/**
 * Copyright Component
 * Renders a copyright statement with a link to the "La boite à son" website
 * and the current year.
 * @param {object} props - Additional properties to be spread onto the Typography component
 * @returns {React.Element} - A Typography component displaying the copyright statement
 */
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="/">
        La boite à son
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function RegisterPage() {
  // States & variables
  const [profilePicture, setProfilePicture] = useState(null);
  const [errorMessages, setErrorMessages] = useState([]);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { setUser, setIsAuthenticated, currentBoxName } =
    useContext(UserContext);
  const navigate = useNavigate();

  /**
   * Handles the change event of the profile picture input element.
   * Updates the profile picture state with the selected file.
   *
   * @param {Event} event - The event object triggered by the change event of the profile picture input element.
   *                       It contains information about the selected file.
   * @returns {void}
   */
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    // console.log(file);
    setProfilePicture(file);
  };

  /**
   * Sends form data to the server and processes the response.
   *
   * @param {FormData} form - The form data to be sent.
   * @returns {Promise<void>} - A Promise that resolves when the request is completed.
   */
  const sendAndProcessData = async (form) => {
    const csrftoken = getCookie("csrftoken");
    // The browser automatically sets the appropriate Content-Type header with the correct boundary value.
    const requestOptions = {
      method: "POST",
      headers: {
        "X-CSRFToken": csrftoken,
      },
      body: form,
    };
    try {
      const response = await fetch("/users/register_user", requestOptions);
      const data = await response.json();
      if (response.ok) {
        // Reset error messages and set registration success flag
        setErrorMessages({});
        setRegistrationSuccess(true);

        setTimeout(() => {
          // Check user status and navigate to the appropriate page
          checkUserStatus(setUser, setIsAuthenticated);
          navigateToCurrentBox(navigate);
        }, 2000);
      } else {
        if (data.errors) {
          console.log(data.errors);
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
   * handleSubmit Function
   * Handles the form submission event by preventing the default form submission behavior,
   * extracting form data, converting it to JSON, and invoking the sendAndProcessData function.
   * @param {Event} event - The form submission event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.append("profile_picture", profilePicture);
    sendAndProcessData(data);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          S'enregistrer
        </Typography>
        {registrationSuccess ? (
          <>
            <Typography variant="body2" color="text.primary" align="center">
              Vous êtes enregistré avec succès!
            </Typography>
            <CircularProgress color="success" />
          </>
        ) : (
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <input
                  type="file"
                  id="profilePicture"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleProfilePictureChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  autoComplete="username"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Nom d'utilisateur"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Adresse email"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password1"
                  label="Mot de passe"
                  type="password"
                  id="password1"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password2"
                  label="Confirmation du mot de passe"
                  type="password"
                  id="password2"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              S'enregistrer
            </Button>
            {Object.keys(errorMessages).map((key) => (
              <Typography
                key={key}
                variant="body2"
                color="error"
                align="center"
              >
                {errorMessages[key][0]}
              </Typography>
            ))}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Vous avez déjà un compte ? S'identifier
                </Link>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
