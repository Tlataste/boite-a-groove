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
        >
          <div className="decoration" style={{ paddingTop: '30px', paddingLeft: '10px', paddingRight: '10px', boxSizing: 'border-box' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px', width: '100%', overflow: 'hidden' }}>
              {boxInfo.box.last_deposits.map((deposit, index) => (
                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`} >
                  <img src={deposit.image_url} alt={`Slide ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                </div>
              ))}
            </div>
          </div>

          <div className="bottom-content">
            <div className="bottom-content__wrapper">
              <button className="btn-secondary">
                <span>
                  {boxInfo.box.name}
                </span>
              </button>

              <h1>{boxInfo.deposit_count} chanson(s) sur cet arrêt, échanges-en une pour la découvrir</h1>


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
