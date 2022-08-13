import { ITokenResponse } from "types/auth";
import * as auth from "firebase/auth";
import { getAuth, signInWithCustomToken } from "firebase/auth";
export const REDIRECT_PATH = `/oauth/callback`;

const LOCALSTORAGE_TOKEN_KEY = "planning_center_utils.access_token";
const LOCALSTORAGE_EXPIRATION_KEY = "planning_center_utils.token_expiration";
const LOCALSTORAGE_REFRESH_TOKEN_KEY = "planning_center_utils.refresh_token";

const BASE_URL =
  "https://us-central1-planning-center-utilities.cloudfunctions.net";

export const getToken = () => {
  return localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
};

export const signIn = () => {
  window.location.replace(
    `${BASE_URL}/authorize?state=${JSON.stringify({
      environment: process.env.NODE_ENV,
    })}`
  );
};

export const signInToFirebase = async () => {
  if (getAuth().currentUser) {
    return;
  }

  const response = await fetch(
    `${BASE_URL}/firebaseToken?token=${getToken()}}`,
    {
      method: "POST",
    }
  );
  signInWithCustomToken(getAuth(), await response.text());
};

export const isSignedIn = () => {
  const access_token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
  if (!access_token) {
    return false;
  }

  const expiration_string = localStorage.getItem(LOCALSTORAGE_EXPIRATION_KEY);

  if (
    !expiration_string ||
    parseInt(expiration_string) < Date.now() / 1000 - 5
  ) {
    return false;
  }

  return true;
};

export const handle_callback = async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  const response = await fetch(`${BASE_URL}/token?code=${code}`, {
    method: "POST",
  });

  const responseData = (await response.json()) as ITokenResponse;
  const pcData = responseData.planningCenterResponse;

  localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, pcData.access_token);
  localStorage.setItem(
    LOCALSTORAGE_EXPIRATION_KEY,
    (pcData.created_at + pcData.expires_in).toString()
  );
  localStorage.setItem(LOCALSTORAGE_REFRESH_TOKEN_KEY, pcData.refresh_token);

  window.location.replace(window.location.origin);
};

export const signOut = () => {
  localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
  localStorage.removeItem(LOCALSTORAGE_EXPIRATION_KEY);
  localStorage.removeItem(LOCALSTORAGE_REFRESH_TOKEN_KEY);

  window.location.replace(window.location.origin);
};
