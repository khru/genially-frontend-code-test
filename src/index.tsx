import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import App from "./components/App";
import { DragAdapterProvider, defaultDragAdapter } from "./ui/DragAdapterProvider";
import * as serviceWorker from "./serviceWorker";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Missing root element");
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <DragAdapterProvider service={defaultDragAdapter}>
      <App />
    </DragAdapterProvider>
  </StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
