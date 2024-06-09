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
    document.getElementById('loader').style.display = "flex";
  }

  return (
    <>
      {boxInfo && Object.keys(boxInfo.box || {}).length > 0 ? (
        <div className={className} >
          <div className="enable-location__wrapper">
            <button className="box-name">
              <span>
                {boxInfo.box.name}
              </span>
            </button>

            <h1>Nous avons besoin de ta localisation</h1>

            <p>Pour éviter les petits tricheurs, les boîtes ne peuvent être ouvertes qu’en étant sur place.</p>

            <p>Ta localisation est uniquement utilisée à l’ouverture d’une boîte</p>

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
