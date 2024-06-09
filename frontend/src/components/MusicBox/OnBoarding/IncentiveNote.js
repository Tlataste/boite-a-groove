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
      <div className="mood-item">

        <div className="mood-item__content">
          {sentence}
        </div>
        <button className="btn-tertiary"
          onClick={() => handleAddNoteButtonClick(note)}
        >
          <span>Attacher</span>
        </button>
      </div>
    );
  }

  return (
    <div className="stage-3__wrapper">

      <div className="step-header">
        <h1>Attache un mot</h1>
        <p>...à ta musique décrivant pourquoi tu l’aimes, ça aidera les prochains voyageurs à faire leur choix</p>
      </div>

      <div className="mood"
      >
        <TabContext value={value}>
          <Box>
            <TabList 
                    onChange={handleChange} 
                    variant="scrollable"
                    aria-label="lab API tabs example">
              <Tab label="Moods" value="1" />
              <Tab label="Quelqu'un" value="2" />
              <Tab label="Période de vie" value="3" />
              <Tab label="Lorem ipsum" value="4" />
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
          <TabPanel value="2">
            {Item("joie", "Cette chanson me met de bonne humeur !")}
          </TabPanel>
          <TabPanel value="3">
            {Item("motive", "Cette chanson me motive pour la journée !")}
          </TabPanel>
          <TabPanel value="3">
            {Item("reflexion", "Cette chanson me fait réfléchir sur la vie.")}
          </TabPanel>
          <TabPanel value="3">
            {Item("reflexion", "Cette chanson me fait réfléchir sur la vie.")}
          </TabPanel>
          <TabPanel value="3">
            {Item("reflexion", "Cette chanson me fait réfléchir sur la vie.")}
          </TabPanel>
          <TabPanel value="3">
            {Item("reflexion", "Cette chanson me fait réfléchir sur la vie.")}
          </TabPanel>
          <TabPanel value="3">
            {Item("reflexion", "Cette chanson me fait réfléchir sur la vie.")}
          </TabPanel>
          <TabPanel value="3">
            {Item("reflexion", "Cette chanson me fait réfléchir sur la vie.")}
          </TabPanel>
          <TabPanel value="3">
            {Item("reflexion", "Cette chanson me fait réfléchir sur la vie.")}
          </TabPanel>
          <TabPanel value="3">
            {Item("reflexion", "Cette chanson me fait réfléchir sur la vie.")}
          </TabPanel>
          <TabPanel value="4">
            {Item("rire", "Cette chanson me fait rire !")}
          </TabPanel>
          <TabPanel value="4">
            {Item("triste", "Cette chanson me rend mélancolique !")}
          </TabPanel>
        </TabContext>

        <button className="btn-primary"
          variant="contained"
          onClick={() => handleAddNoteButtonClick("")}
        >
          <span>Continuer sans note</span>
        </button>

        <div className="bottom-panel">
          <ul className="search-results">
            <li>
            <div className="img-container">
              <img
                src={searchSong.image_url}
                alt={searchSong.name}
              />
            </div>

            <div className="song">
              <p className="song-title" variant="h6">{searchSong.name}</p>
              <p className="song-subtitle" variant="subtitle2">{searchSong.artist}</p>
            </div>

            <button
              onClick={() => setStage(2)}
            >
              <span>Changer</span>
            </button>

            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
