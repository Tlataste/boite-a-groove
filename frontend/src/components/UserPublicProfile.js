import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import MenuAppBar from "./Menu";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "./UsersUtils";

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
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); // Empty dependency array ensures the effect is only run once

  return (
    <>
      <MenuAppBar />
    </>
  );
}
