import * as React from "react";
import { useState, useContext } from "react";
import { UserContext } from "./UserContext";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { checkUserStatus } from "./UsersUtils";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

/**
Copyright Component
Renders a copyright statement with a link to the "La boite à son" website
and the current year.
@param {object} props - Additional properties to be spread onto the Typography component
@returns {React.Element} - A Typography component displaying the copyright statement
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

export default function LoginPage() {
  // States & Variables
  const [authenticationSuccess, setAuthenticationSuccess] = useState(false);
  const [errorMessages, setErrorMessages] = useState("");
  const { user, setUser, isAuthenticated, setIsAuthenticated, currentBoxName } =
    useContext(UserContext);
  const navigate = useNavigate();

  /**
   * sendAndProcessData Function
   * Sends a POST request with the data in JSON to "/users/login_user" endpoint,
   * processes the response, and handles potential errors.
   * @param {JSON} form - The data in JSON to be sent in the request body
   * @returns {Promise<void>} - A Promise that resolves when the request is completed
   */
  const sendAndProcessData = async (form) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: form,
    };
    try {
      const response = await fetch("/users/login_user", requestOptions);
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setAuthenticationSuccess(true);
        setErrorMessages("");
        setTimeout(() => {
          checkUserStatus(setUser, setIsAuthenticated);
          navigate("/box/" + currentBoxName);
        }, 2000);
      } else {
        if (response.status === 401) {
          setErrorMessages("Informations d'identification non valides");
        } else {
          setErrorMessages("Vous êtes déjà connecté");
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
    const jsonData = JSON.stringify({
      username: data.get("username"),
      password: data.get("password"),
    });
    console.log(jsonData);
    sendAndProcessData(jsonData);
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
          Se connecter
        </Typography>
        {authenticationSuccess ? (
          <>
            <Typography variant="body2" color="text.primary" align="center">
              Vous vous êtes connecté avec succès!
            </Typography>
            <CircularProgress color="success" />
          </>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nom d'utilisateur"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Se souvenir de moi"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Se connecter
            </Button>
            <Typography variant="body2" color="error" align="center">
              {errorMessages}
            </Typography>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Vous n'avez pas de compte ? S'inscrire"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
