import React, { Component } from "react";
import { render } from "react-dom";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <h1>Test</h1>;
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv); // Render the App component inside the app Div (in the index.html)
