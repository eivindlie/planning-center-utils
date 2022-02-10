import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import "./style/base.css";
import {
  handle_callback,
  isSignedIn,
  REDIRECT_PATH,
  signIn,
} from "./utils/auth";

if (window.location.pathname.startsWith(REDIRECT_PATH)) {
  handle_callback();
} else if (!isSignedIn()) {
  signIn();
} else {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
  );
}
