import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { getCookie } from "../../Security/TokensUtils";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { getUserDetails } from "../../UsersUtils";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { checkUserStatus } from "../../UsersUtils";
import { UserContext } from "../../UserContext";

/**
 * SongCard Component
 * Displays a card representing a song with its title, artist, and album cover image.
 * @param {Object} deposits - An object containing song deposit data.
 * @param {boolean} isDeposited - A boolean indicating whether the song has been deposited.
 * @param setStage - A function used to set the stage of the page
 * @param setDispSong - A function used to set the song that we will display
 * @param searchSong
 * @returns {JSX.Element} - JSX element representing the SongCard component.
 */
export default function SongDisplay({ dispSong, depositedBy, achievements }) {
  // States
  const [selectedProvider, setSelectedProvider] = useState("spotify");

  const { isAuthenticated, setUser, setIsAuthenticated } =
    useContext(UserContext);

  // Stores all the information about the user who has deposited the song
  const [userInfo, setUserInfo] = useState({});

  const navigate = useNavigate();

  setTimeout(() => {
    document.querySelector('.reveal__notification').classList.add('active');
  }, "1000");

  /**
   * Handles the click event for the "Go to link" button.
   */
  function redirectToLink() {
    const csrftoken = getCookie("csrftoken");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
      body: JSON.stringify({
        song: dispSong,
        platform: selectedProvider,
      }),
    };

    fetch("../api_agg/aggreg", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.open(data);
      });
  }

  /**
   * Handles the change event for the provider selection dropdown.
   * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event object.
   */
  function handleProviderChange(event) {
    setSelectedProvider(event.target.value);
  }

  // Gets the info of the user who has depisoted the song discovered and update the points of the current user
  useEffect(() => {
    getUserDetails(depositedBy, navigate)
      .then((data) => {
        setUserInfo(data);
      })
      .catch((error) => {
        console.error(error);
      });
    checkUserStatus(setUser, setIsAuthenticated);
  }, []); // Empty dependency array ensures the effect is only run once

  //

  function fakeSelect(event) {

      let spotify = document.querySelector('#fake-select li.spotify');
      let deezer = document.querySelector('#fake-select li.deezer');
      let newSelected = document.querySelector('#fake-select li.'+ event.target.classList);
      let realSelect = document.querySelector('.reveal select');
      let realSelectWrapper = document.querySelector('.select');
  
      if(realSelectWrapper.classList.contains('open')) {
        realSelectWrapper.classList.remove('open');
        if (newSelected.classList.contains('spotify')) {
          spotify.classList.add('selected');
          deezer.classList.remove('selected');
          realSelect.value = "spotify";
          setSelectedProvider("spotify");
        } else {
          spotify.classList.remove('selected');
          deezer.classList.add('selected');
          realSelect.value = "deezer";
          setSelectedProvider("deezer");
        }
      } else {
        realSelectWrapper.classList.add('open');
      }
  }

  return (

    <div className="reveal">

        <div className="reveal__notification">
          Ta chanson a été déposée avec succès 👍
        </div>


        <div className="song__cover">
          <div className="song__cover__image">
            <CardMedia
                component="img"
                sx={{ width: 168 }}
                image={dispSong.image_url}
                alt="Track cover"
              />
            <p className="song__title">{dispSong.title}</p>
          </div>
        </div>

        <div className="song__information">
          <h1>{dispSong.title}</h1>
          <p>{dispSong.artist}</p>
        </div>

        <div className="select">

          <button className="label"
              onClick={() => {
                redirectToLink();
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Ecouter sur
          </button>

          <ul id="fake-select">
            <li className="spotify selected">
              <button onClick={fakeSelect}>
                <span className="sr-only">Spotify</span>
                <img className="spotify" src="/static/images/spotify-logo.svg" alt=""/>
              </button>
            </li>
            <li className="deezer">
              <button onClick={fakeSelect}>
                <span className="sr-only">Deezer</span>
                <img className="deezer" src="/static/images/deezer-logo.svg" alt=""/>
              </button>
            </li>
          </ul>
  
        </div>

        <select value={selectedProvider} onChange={handleProviderChange}>
            <option value="spotify">Spotify</option>
            <option value="deezer">Deezer</option>
        </select>

        
        <div className="author d-flex">
        <Avatar
            src={userInfo.profile_picture}
            alt={userInfo.username}
            sx={{
              width: "68px",
              height: "68px",
            }}
          />
          <div className="author__informations">
            <p className="author__informations__name">{userInfo.username}</p>
            <button onClick={() => navigate("/profile/" + depositedBy)}
                    className="author__informations__link">
                      Voir le profil
            </button>
          </div>
          <p className="deposit-number">{userInfo.total_deposits + "ème dépôt"}</p>
        </div>


     
        {/* <Box
          sx={{
            marginTop: 2,
            overflow: "auto",
            maxHeight: 200,
            borderRadius: "borderRadius",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <List sx={{ padding: 1 }}>
            {Object.keys(achievements).map((achievementKey) => {
              const achievement = achievements[achievementKey];

              return (
                <ListItem key={achievementKey} disablePadding>
                  <ListItemText
                    primary={achievement.name}
                    secondary={achievement.desc}
                  />
                  <Typography variant="body2">
                    Points gagnés: {achievement.points}
                  </Typography>
                </ListItem>
              );
            })}
          </List>
        </Box> */}
 

    </div>



  );
}
