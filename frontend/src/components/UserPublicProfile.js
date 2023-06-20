import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import MenuAppBar from "./Menu";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "./UsersUtils";
import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import AlbumIcon from "@mui/icons-material/Album";
import Grid from "@mui/material/Grid";

export default function UserPublicProfile() {
  // States & Variables
  const navigate = useNavigate();

  // Gets userID from URL
  const { userID } = useParams();

  // Stores all the information about the box
  const [userInfo, setUserInfo] = useState({});

  /**
   * Function to be executed when the component is mounted and the page is loaded
   * Check at page load (only) if user is authenticated with spotify and get the box's details
   */
  useEffect(() => {
    getUserDetails(userID, navigate)
      .then((data) => {
        setUserInfo(data);
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); // Empty dependency array ensures the effect is only run once

  return (
    <>
      <MenuAppBar />
      <Box sx={{ padding: "16px" }}>
        {userInfo ? (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "left",
                gap: "10px",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={8}>
                  <Typography
                    variant="h4"
                    sx={{
                      letterSpacing: "0.3rem",
                      textTransform: "uppercase",
                    }}
                  >
                    {userInfo.username}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Avatar
                    src={userInfo.profile_picture}
                    alt={userInfo.username}
                    sx={{
                      width: "40px",
                      height: "40px",
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Typography variant="subtitle1">
                      {userInfo.points}
                    </Typography>
                    <AlbumIcon
                      sx={{
                        color: "#fa4000",
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="subtitle2">
                {userInfo.total_deposits +
                  " autres pépites partagées par cet utilisateur"}
              </Typography>
            </Box>
          </>
        ) : (
          <Typography variant="h1">Loading...</Typography>
        )}
      </Box>
    </>
  );
}
