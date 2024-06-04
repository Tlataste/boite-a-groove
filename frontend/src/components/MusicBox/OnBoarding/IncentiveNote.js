import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { getCookie } from "../../Security/TokensUtils";
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


export default function IncentiveNote({
  setStage,
  searchSong,
  setSearchSong,
  boxInfo,
  setDispSong,
  setDepositedBy,
  setAchievements
}) {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  /**
   * Handles the click event of the "Ajouter" button in the Item component, triggering the process of adding a note to a deposit.
   * @param {string} note - The note to be added.
   * @returns {void}
   */
  function handleAddNoteButtonClick(note) {
    // setDepositNote(searchSong.id, note).then(() => setStage(4));
    setSearchSong(currentSearchSong => ({ ...currentSearchSong, note: note }));
    const csrftoken = getCookie("csrftoken");

    fetch('/box-management/create-deposit/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify({
        option: searchSong,
        box_id: boxInfo.box.id,
        // visible_deposit: { id: searchSong.visible_deposit_id }
      }),
    })
      .then(response => response.json())
      .then(data => {
        const { new_deposit, last_deposit, song, achievements } = data;
        console.log(data)
        setDispSong(song);
        setDepositedBy(last_deposit.user);
        setAchievements(achievements);
        // Skip directly to stage 5
        setStage(5);
      })
      .catch(error => {
        console.error(error);
      });
  }
  //   setStage(4);
  // }

  /**
   * Item component represents a UI element displaying a note and a button to add the note.
   * @param {string} note - The note to be added.
   * @param {string} sentence - The sentence to be displayed as a subtitle.
   * @returns {JSX.Element} - The rendered JSX element representing the item.
   */
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
        onClick={() => handleAddNoteButtonClick("")}
      >
        Continuer sans note
      </Button>
    </Box>
  );
}
