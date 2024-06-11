import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { getCookie } from "../../Security/TokensUtils";

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
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function handleAddNoteButtonClick(note) {
    setSearchSong(currentSearchSong => {
      const updatedSearchSong = { ...currentSearchSong, note: note };
      return updatedSearchSong;
    });

    const csrftoken = getCookie("csrftoken");

    fetch('/box-management/create-deposit/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify({
        option: { ...searchSong, note },
        box_id: boxInfo.box.id,
      }),
    })
      .then(response => response.json())
      .then(data => {
        const { new_deposit, last_deposit, song, achievements } = data;
        setDispSong(song);
        setDepositedBy(last_deposit.user);
        setAchievements(achievements);
        setStage(5);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const Item = ({ note, sentence }) => (
    <div className="mood-item">
      <div className="mood-item__content">
        {sentence}
      </div>
      <button className="btn-tertiary" onClick={() => handleAddNoteButtonClick(note)}>
        <span>Attacher</span>
      </button>
    </div>
  );

  return (
    <div className="stage-3__wrapper">
      <div className="step-header">
        <h1>Attache un mot</h1>
        <p>...à ta musique décrivant pourquoi tu l’aimes, ça aidera les prochains voyageurs à faire leur choix</p>
      </div>

      <div className="mood">
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
            <Item note="calme" sentence="Cette chanson m'apaise et me détend !" />
            <Item note="danse" sentence="Cette chanson me donne envie de danser !" />
            <Item note="inspire" sentence="Cette chanson me pousse à être créatif !" />
          </TabPanel>
          <TabPanel value="2">
            <Item note="joie" sentence="Cette chanson me met de bonne humeur !" />
          </TabPanel>
          <TabPanel value="3">
            <Item note="motive" sentence="Cette chanson me motive pour la journée !" />
            <Item note="reflexion" sentence="Cette chanson me fait réfléchir sur la vie." />
          </TabPanel>
          <TabPanel value="4">
            <Item note="rire" sentence="Cette chanson me fait rire !" />
            <Item note="triste" sentence="Cette chanson me rend mélancolique !" />
          </TabPanel>
        </TabContext>

        <button className="btn-primary" variant="contained" onClick={() => handleAddNoteButtonClick("")}>
          <span>Continuer sans note</span>
        </button>

        <div className="bottom-panel">
          <ul className="search-results">
            <li>
              <div className="img-container">
                <img src={searchSong.image_url} alt={searchSong.name} />
              </div>
              <div className="song">
                <p className="song-title" variant="h6">{searchSong.name}</p>
                <p className="song-subtitle" variant="subtitle2">{searchSong.artist}</p>
              </div>
              <button onClick={() => setStage(2)}>
                <span>Changer</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

