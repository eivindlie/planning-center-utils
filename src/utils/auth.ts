const SCOPE = "people";
const REDIRECT_URI = `${window.location.origin}/callback`;

const LOCALSTORAGE_TOKEN_KEY = "access_token";
const LOCALSTORAGE_EXPIRATION_KEY = "token_expiration";

export const getToken = () => {
  return localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
};

export const signIn = () => {};

export const isSignedIn = () => {
  const access_token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
  if (!access_token) {
    return false;
  }

  const expiration_string = localStorage.getItem("token_expiration");

  if (
    !expiration_string ||
    parseInt(expiration_string) < Date.now() / 1000 - 5
  ) {
    return false;
  }

  return true;
};

export const handle_callback = async () => {};
