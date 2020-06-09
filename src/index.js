import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

import FetchMarkdown from "./FetchMarkdown";
import ReadMeText from "../public/README.md";

import "bootstrap";

const rootElement = document.getElementById("root");

const appJSX = <App />;

const readMeJSX = (
  <div>
    <button
      className="btn btn-info btn-block"
      type="button"
      data-toggle="collapse"
      data-target="#collapseReadMe"
    >
      Read Me
    </button>
    <div
      id="collapseReadMe"
      className="container border-warning mt-2 shadow-sm card card-body collapse"
    >
      <FetchMarkdown input={ReadMeText} />
    </div>
  </div>
);

const JSX = (
  <React.StrictMode>
    <div
      className="container border border-warning rounded my-3 py-3"
      style={{ maxWidth: "700px" }}
    >
      {appJSX}
      <div className="mb-2" />
      {readMeJSX}
    </div>
  </React.StrictMode>
);

ReactDOM.render(JSX, rootElement);
