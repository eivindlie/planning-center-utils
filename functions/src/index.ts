import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
import * as cors from "cors";
import { ITokenResponse } from "./types";
import { UserRecord } from "firebase-functions/v1/auth";
import { IProfileResponse, IFirebaseUserProfile } from "./types";
import { firestore } from "firebase-admin";

const BASE_URL = "https://api.planningcenteronline.com/oauth";
const SCOPE = "people services";
const REDIRECT_URI =
  "https://us-central1-planning-center-utilities.cloudfunctions.net/redirect";

const CORS_WHITELIST = [
  "http://localhost:3000",
  "https://planning-center.andreassen.info",
];

admin.initializeApp(functions.config().firebase);

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

    const tokenResponseData = (await tokenResponse.json()) as ITokenResponse;

    const userRecord = await getOrCreateUser(tokenResponseData.access_token);

    functions.logger.log("getOrCreateUser returned", userRecord);

    const firebaseToken = await admin.auth().createCustomToken(userRecord.uid);

    functions.logger.log("Created firebase token");

    const responseData = {
      planningCenterResponse: tokenResponseData,
      firebaseToken: firebaseToken,
    };

    response.send(JSON.stringify(responseData));
  });
});

export const firebaseToken = functions.https.onRequest(
  async (request, response) => {
    cors(corsOptions)(request, response, async () => {
      const pcProfile = await getPcProfile(request.query.token as string);

      if (pcProfile.data.attributes.status != "active") {
        throw new Error("User is not active in Planning Center");
      }

      const firebaseToken = await admin
        .auth()
        .createCustomToken(pcProfile.data.id);

      response.send(firebaseToken);
    });
  }
);

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

const getPcProfile = async (authToken: string): Promise<IProfileResponse> => {
  const response = await fetch(
    "https://api.planningcenteronline.com/people/v2/me?include=emails",
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  const profileResult = (await response.json()) as IProfileResponse;
  return profileResult;
};

const getOrCreateUser = async (pcAuthToken: string): Promise<UserRecord> => {
  const profile = await getPcProfile(pcAuthToken);
  functions.logger.log("Profile", profile);
  const primaryEmail = profile.included
    .filter((i) => i.type === "Email")
    .find((e) => e.attributes.primary)?.attributes.address;

  if (profile.data.attributes.status !== "active") {
    throw new Error("User is not active in Planning Center");
  }

  let userRecord: UserRecord | undefined;
  try {
    userRecord = await admin.auth().getUser(profile.data.id);
  } catch {}

  functions.logger.log("Existing user record", userRecord);

  if (!userRecord) {
    userRecord = await admin.auth().createUser({
      uid: profile.data.id,
      displayName: `${profile.data.attributes.first_name} ${
        profile.data.attributes.middle_name
          ? `${profile.data.attributes.middle_name} `
          : ""
      }${profile.data.attributes.last_name}`,
      email: primaryEmail,
      emailVerified: true,
      disabled: false,
    });

    await firestore()
      .doc(`users/${userRecord.uid}`)
      .set({
        name: userRecord.displayName,
        email: userRecord.email,
      } as IFirebaseUserProfile);
    functions.logger.log("Created user record", userRecord);
  }

  return userRecord;
};
