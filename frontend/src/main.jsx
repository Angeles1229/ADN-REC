import React from "react";
import ReactDOM from "react-dom/client"; // Cambiar importación
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // Cambiar render a createRoot
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
