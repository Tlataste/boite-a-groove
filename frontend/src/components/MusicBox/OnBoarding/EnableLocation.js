import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "../Menu";
import LiveSearch from "./LiveSearch";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { checkSpotifyAuthentication } from "./SpotifyUtils";
import { checkDeezerAuthentication } from "./DeezerUtils";
import { getBoxDetails } from "./BoxUtils";
import SongCard from "./SongCard";

export default function EnableLocation() {
  // States & Variables

  return (
    <>
      <h1>EnableLocation</h1>
    </>
  );
}
