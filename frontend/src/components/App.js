import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import { render } from "react-dom";
import HomePage from "./HomePage";
import RegisterPage from "./RegisterPage";
import MusicBox from "./MusicBox/MusicBox";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/box/:boxName" element={<MusicBox />} />
        </Routes>
      </Router>
    );
  }
}

const appDiv = document.getElementById("app");
//render(<App />, appDiv); // Render the App component inside the app Div (in the index.html) deprecated
createRoot(appDiv).render(<App />);
