import * as functions from "firebase-functions";
import fetch from "node-fetch";
import * as cors from "cors";

const BASE_URL = "https://api.planningcenteronline.com/oauth";
const SCOPE = "people services";
const REDIRECT_URI =
  "https://us-central1-planning-center-utilities.cloudfunctions.net/redirect";

const CORS_WHITELIST = [
  "https://localhost:3000",
  "https://planning-center.andreassen.info",
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (origin && CORS_WHITELIST.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

export const authorize = functions.https.onRequest(
  async (request, response) => {
    cors(corsOptions)(request, response, () => {
      response.redirect(
        `${BASE_URL}/authorize?client_id=${
          functions.config().planningcenter.clientid
        }&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&state=${
          request.query.state
        }`
      );
    });
  }
);

export const token = functions.https.onRequest(async (request, response) => {
  cors(corsOptions)(request, response, async () => {
    const url = `${BASE_URL}/token`;

    const body = {
      grant_type: "authorization_code",
      code: request.query.code,
      client_id: functions.config().planningcenter.clientid,
      client_secret: functions.config().planningcenter.clientsecret,
      redirect_uri: REDIRECT_URI,
    };

    const tokenResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    response.send(await tokenResponse.text());
  });
});

export const redirect = functions.https.onRequest(async (request, response) => {
  cors(corsOptions)(request, response, () => {
    const state = JSON.parse(request.query.state as string);
    let url: string;
    if (state["environment"] === "development") {
      url = "http://localhost:3000/oauth/callback";
    } else {
      url = "https://planning-center.andreassen.info/oauth/callback";
    }
    response.redirect(`${url}?code=${request.query.code}`);
  });
});
