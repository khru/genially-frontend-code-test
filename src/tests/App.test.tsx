import React from "react";
import * as ReactDOM from "react-dom";
import App from "../components/App";

test("Renders correctly the app", () => {
  const div = document.createElement("div");
  const render = ReactDOM.render as (
    element: React.ReactElement,
    container: Element | DocumentFragment | null,
    callback?: () => void
  ) => unknown;
  render(React.createElement(App), div);
  ReactDOM.unmountComponentAtNode(div);
});
