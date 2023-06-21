import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { setDepositNote } from "../BoxUtils";

// Styles
const styles = {
  button: {
    borderRadius: "20px",
    backgroundImage: "linear-gradient(to right, #fa9500, #fa4000)",
    color: "white",
    border: "none",
    textTransform: "none",
    "&:hover": {
      border: "none",
    },
  },
};

export default function IncentiveNote({ setStage, searchSong }) {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function handleAddNoteButtonClick(note) {
    setDepositNote(searchSong.id, note).then(() => setStage(4));
  }

  function Item(note, sentence) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <Typography variant="subtitle1">{sentence}</Typography>
        <Button
          style={styles.button}
          variant="contained"
          onClick={() => handleAddNoteButtonClick(note)}
        >
          Ajouter
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
      }}
    >
      <Typography variant="h6">Ajoute une note d'incitation</Typography>
      <Box
        sx={{
          width: "90%",
          typography: "body1",
          backgroundColor: "white",
          margin: "auto",
          borderRadius: "20px",
        }}
      >
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Moods" value="1" />
              <Tab label="Quelqu'un" value="2" />
              <Tab label="Période de vie" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            {Item("calme", "Cette chanson m'apaise et me détend !")}
          </TabPanel>
          <TabPanel value="1">
            {Item("danse", "Cette chanson me donne envie de danser !")}
          </TabPanel>
          <TabPanel value="1">
            {Item("inspire", "Cette chanson me pousse à être créatif !")}
          </TabPanel>
          <TabPanel value="1">
            {Item("joie", "Cette chanson me met de bonne humeur !")}
          </TabPanel>
          <TabPanel value="1">
            {Item("motive", "Cette chanson me motive pour la journée !")}
          </TabPanel>
          <TabPanel value="1">
            {Item("reflexion", "Cette chanson me fait réfléchir sur la vie.")}
          </TabPanel>
          <TabPanel value="1">
            {Item("rire", "Cette chanson me fait rire !")}
          </TabPanel>
          <TabPanel value="1">
            {Item("triste", "Cette chanson me rend mélancolique !")}
          </TabPanel>
        </TabContext>
      </Box>
      <Button
        style={styles.button}
        variant="contained"
        onClick={() => setStage(4)}
      >
        Continuer sans note
      </Button>
    </Box>
  );
}
