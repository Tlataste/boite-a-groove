import * as React from "react";
import { useState } from "react";
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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { json } from "react-router-dom";

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
  const [errorMessages, setErrorMessages] = useState([]);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Methods
  const sendAndProcessData = async (form) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: form,
    };
    try {
      const response = await fetch("/users/register_user", requestOptions);
      const data = await response.json();
      if (response.ok) {
        setErrorMessages({});
        setRegistrationSuccess(true);
      } else {
        if (data.errors) {
          console.log(data.errors);
          setErrorMessages(data.errors);
        } else {
          console.log("No errors returned");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = JSON.stringify({
      username: data.get("username"),
      email: data.get("email"),
      password1: data.get("password1"),
      password2: data.get("password2"),
      first_name: data.get("firstName"),
      last_name: data.get("lastName"),
    });
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
          S'enregistrer
        </Typography>
        {registrationSuccess ? (
          <Typography variant="body2" color="text.primary" align="center">
            Vous êtes enregistré avec succès!
          </Typography>
        ) : (
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Prénom"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Nom"
                  name="lastName"
                  autoComplete="family-name"
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
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="Je souhaite recevoir des promotions marketing et des mises à jour par courrier électronique."
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
