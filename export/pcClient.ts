import fetch from "node-fetch";

export const getPcEndpoint = async (endpoint: string) => {
  const username = process.env.PC_CLIENT_ID;
  const password = process.env.PC_CLIENT_SECRET;
  const result = await fetch(
    `https://api.planningcenteronline.com/services/v2/${endpoint}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString(
          "base64"
        )}`,
      },
    }
  );

  return await result.json();
};
