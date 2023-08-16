import React, { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function BoxStartup({ setStage, boxInfo, className }) {
  return (
    <>
      {boxInfo && Object.keys(boxInfo.box || {}).length > 0 ? (
        <Paper
          className={className}
          elevation={3}
          sx={{
            background: "blue",
          }}
        >
          <div className="decoration">
          </div>
          <div className="bottom-content">
            <div class="bottom-content__wrapper">
              <button class="btn-secondary">
                <span>
                  {boxInfo.box.name}
                </span>
              </button>
              
              <h1>{boxInfo.deposit_count} chansons sur cet arrêt, échanges-en une pour la découvrir</h1>
        

              <button
                className="btn-primary"
                onClick={() => setStage(1)}
              >
                <span>Commencer</span>
              </button>

            </div>

          </div>
        </Paper>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
