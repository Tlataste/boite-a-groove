import React, { useState, useEffect } from "react";
import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { getCookie } from "../Security/TokensUtils";

export default function LiveSearch({
  isSpotifyAuthenticated,
  isDeezerAuthenticated,
  boxName,
  setIsDeposited,
  user,
  setStage,
  setSearchSong,
  setAchievements,
  setFavoriteSong = false,
  onSuccess = () => { }
}) {
  const [searchValue, setSearchValue] = useState("");
  const [jsonResults, setJsonResults] = useState([]);
  const [selectedStreamingService, setSelectedStreamingService] = useState(
    user.preferred_platform || "spotify"
  );

  /**
   * Updates the selectedStreamingService when the user's preferred_platform changes.
   *
   * @param {function} callback - The function to be executed as the side effect.
   * @param {Array} dependencies - Triggers the callback function when the user's preferred_platform changes.
   */
  useEffect(() => {
    if (user.preferred_platform) {
      setSelectedStreamingService(user.preferred_platform);
    }
  }, [user.preferred_platform]);

  /**
   * useEffect hook that executes when the component mounts or when the 'searchValue' or 'streamingService' dependencies change.
   *
   * - Retrieves data based on certain conditions:
   *   - If 'searchValue' is empty and the user is authenticated with the selected streaming service, fetches recent tracks.
   *   - If 'searchValue' is not empty, performs a search using the 'searchValue'.
   * - Sets the retrieved data to the 'jsonResults' state variable.
   * - Clears the timeout when the component unmounts or when the 'searchValue' or 'streamingService' dependencies change.
   */
  useEffect(() => {
    const getData = setTimeout(() => {
      // Check if the user has selected spotify or deezer
      if (selectedStreamingService === "spotify") {
        console.log(searchValue);
        // Check if the search bar is empty
        if (searchValue === "") {
          console.log('search empty');
          // Check if the user is authenticated with spotify
          if (isSpotifyAuthenticated) {
            console.log('authenticated');
            fetch("/spotify/recent-tracks")
              .then((response) => response.json())
              .then((data) => {
                setJsonResults(data);
                console.log(data);
              });
          } else {
            setJsonResults([]);
          }
        } else {
          const csrftoken = getCookie("csrftoken");
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({
              search_query: searchValue,
            }),
          };

          fetch("/spotify/search", requestOptions)
            .then((response) => response.json())
            .then((data) => {
              setJsonResults(data);
            });
        }
      }
      // Check if the user has selected deezer
      if (selectedStreamingService === "deezer") {
        // Check if the search bar is empty
        if (searchValue === "") {
          // Check if the user is authenticated with deezer
          if (isDeezerAuthenticated) {
            fetch("/deezer/recent-tracks")
              .then((response) => response.json())
              .then((data) => {
                setJsonResults(data);
              });
          } else {
            setJsonResults([]);
          }
        } else {
          const csrftoken = getCookie("csrftoken");
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({
              search_query: searchValue,
            }),
          };
          // Perform a search using the searchValue and set the results to the jsonResults state variable
          fetch("/deezer/search", requestOptions)
            .then((response) => response.json())
            .then((data) => {
              setJsonResults(data);
            });
        }
      }
    }, 400);

    return () => clearTimeout(getData);
  }, [
    searchValue,
    selectedStreamingService,
    isDeezerAuthenticated,
    isSpotifyAuthenticated,
  ]);

  /**
   * Handles the deposit of a song to a box.
   * @param option - The selected option.
   * @param boxName - The name of the box.
   */
  function handleButtonClick(option, boxName) {
    if (setFavoriteSong) {
      const data = { option };
      const jsonData = JSON.stringify(data);
      const csrftoken = getCookie("csrftoken");
      fetch("/users/set-favorite-song", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: jsonData,
      })
        .then((response) => response.json())
        .then((data_resp) => {
          console.log(data_resp);
          onSuccess();
          // Set the search song to the new deposit
          // setSearchSong(data_resp.new_deposit);
          // setAchievements(data_resp.achievements);
        })
    } else {
      // const data = { option, boxName };
      // const jsonData = JSON.stringify(data);
      // const csrftoken = getCookie("csrftoken");
      // fetch("/box-management/get-box?name=" + boxName, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "X-CSRFToken": csrftoken,
      //   },
      //   body: jsonData,
      // })
      //   .then((response) => response.json())
      //   .then((data_resp) => {
      //     console.log(data_resp);
      //     // Set the search song to the new deposit
      //     setSearchSong(data_resp.new_deposit);
      //     setAchievements(data_resp.achievements);
      //   });
      setSearchSong(option);
      setIsDeposited(true);
      setStage(3);
    }
  }

  /**
   * Handles the change of the streaming service.
   * @param service - The selected streaming service.
   */
  function handleStreamingServiceChange(service) {
    setSelectedStreamingService(service);
  }

  return (
    <Stack>
      <div className="search-song">
        <h1>Choisi une chanson à déposer</h1>
        {/* <h2>{setFavoriteSong == true ? 'Choisis ta chanson préférée' : 'Choisis ta chanson à déposer'}</h2> */}

        <div className="d-flex">
            <button
              className="btn-spotify"
              variant={
                selectedStreamingService === "spotify" ? "contained" : "outlined"
              }
              onClick={() => handleStreamingServiceChange("spotify")}
              sx={{ marginRight: "5px" }}
            >
              Spotify
            </button>
            <button
              className="btn-deezer"
              variant={
                selectedStreamingService === "deezer" ? "contained" : "outlined"
              }
              onClick={() => handleStreamingServiceChange("deezer")}
            >
              Deezer
            </button>
          </div>

        <div className="search-song__wrapper">

    


          <div className="input-wrapper">
            <input type="text"
              placeholder="Search for a song"
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

        </div>
      </div>




      <ul className="search-results">
        {jsonResults.map(option => (
          <Box component="li" key={option.id}>
            <div className="img-container">
              <img
                src={option.image_url}
                alt={option.name}
              />
            </div>

            <div className="song">
              <p className="song-title" variant="h6">{option.name}</p>
              <p className="song-subtitle" variant="subtitle2">{option.artist}</p>
            </div>

            <button
              className="btn-tertiary"
              variant="contained"
              onClick={() => handleButtonClick(option, boxName)}
            >
              <span>Choisir</span>
            </button>

          </Box>
        ))}
      </ul>

    </Stack>
  );
}
