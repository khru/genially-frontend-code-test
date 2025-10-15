import React from "react";
import * as ReactDOM from "react-dom";
import "./main.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Missing root element");
}

const render = ReactDOM.render as (
  element: React.ReactElement,
  container: Element | DocumentFragment | null,
  callback?: () => void
) => unknown;

render(React.createElement(App), rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
