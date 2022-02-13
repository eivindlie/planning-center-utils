import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { initializeApp } from "firebase/app";
import App from "./components/App";
import "style/base.css";
import "../node_modules/line-awesome/dist/line-awesome/css/line-awesome.min.css";
import {
  handle_callback,
  isSignedIn,
  REDIRECT_PATH,
  signIn,
} from "./utils/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC55XSmQ3-6jOnkXYthLsTjz-Og83Kphss",
  authDomain: "planning-center-utilities.firebaseapp.com",
  projectId: "planning-center-utilities",
  storageBucket: "planning-center-utilities.appspot.com",
  messagingSenderId: "817057182443",
  appId: "1:817057182443:web:93b3979c192d34d13104ae",
};
initializeApp(firebaseConfig);

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
