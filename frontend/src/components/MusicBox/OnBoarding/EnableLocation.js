import React, { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { checkLocation } from "../BoxUtils";
import CircularProgress from "@mui/material/CircularProgress";

export default function EnableLocation({ setStage, boxInfo, navigate, className }) {
  // States & Variables

  const [isButtonClicked, setIsButtonClicked] = useState(false);

  function handleButtonClick() {
    setIsButtonClicked(true);
    checkLocation(boxInfo, navigate).then(() => setStage(2));
  }

  return (
    <>
      {boxInfo && Object.keys(boxInfo.box || {}).length > 0 ? (


        <div
          className={className}
        >

        <div class="enable-location__wrapper">
          <button class="btn-secondary">
            <span>
              {boxInfo.box.name}
            </span>
          </button>

          <h1>Autoriser la localisation</h1>

          <p>Confirme que tu es bien à l'arrêt en partageant ta localisation. Ta localisation est uniquement utilisée à l'ouverture d'une boîte.</p>

          <button
            className="btn-primary"
            onClick={handleButtonClick}
          >
              <span>Autoriser</span>
          </button>

        </div>

        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
