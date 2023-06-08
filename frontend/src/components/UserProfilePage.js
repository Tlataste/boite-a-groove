import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
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
};

const UserProfilePage = () => {
  const [password, setPassword] = useState("********");

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

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
          <Typography variant="h5">John Doe</Typography>
        </Grid>
      </Grid>
      <Typography variant="h6" gutterBottom>
        Informations personnelles
      </Typography>
      <TextField
        style={styles.textField}
        label="First Name"
        variant="outlined"
        fullWidth
        value="John"
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        style={styles.textField}
        label="Last Name"
        variant="outlined"
        fullWidth
        value="Doe"
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        style={styles.textField}
        label="Nom d'utilisateur"
        variant="outlined"
        fullWidth
        value="John.D"
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        style={styles.textField}
        label="Email"
        variant="outlined"
        fullWidth
        value="john.doe@example.com"
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
    </div>
  );
};

export default UserProfilePage;
