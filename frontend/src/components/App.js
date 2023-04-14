import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <HomePage />
      </div>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv); // Render the App component inside the app Div (in the index.html)
