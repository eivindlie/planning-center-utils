import fetch from "node-fetch";

type PcObject = {
    id: string;
    attributes: {[key: string]: string | boolean | number};
}
type PcResult = {
    links: {[key: string]: string},
    data: PcObject[],
    included: PcObject[],
    "meta": {
        "total_count": number,
        "count": number,
        "can_query_by": string[],
        "can_filter": string[],
        "parent": {
            id: string,
            type: string,
        }
    }
}

export const getPcEndpoint = async (endpoint: string): Promise<PcResult> => {
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

  if (result.status === 429) {
    const retryAfter = result.headers.get("Retry-After");
    if (retryAfter) {
      await new Promise((resolve) => setTimeout(resolve, parseInt(retryAfter) * 1000));
      return await getPcEndpoint(endpoint);
    }
    throw new Error("Rate limit exceeded");
  }

  return await result.json() as PcResult;
};
