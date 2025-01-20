import fetch, { Response } from "node-fetch";

type PcObject = {
  id: string;
  attributes: { [key: string]: string | boolean | number };
};
type PcResult = {
  links: { [key: string]: string };
  data: PcObject[];
  included: PcObject[];
  meta: {
    total_count: number;
    count: number;
    can_query_by: string[];
    can_filter: string[];
    parent: {
      id: string;
      type: string;
    };
    next: {
        offset: number;
    };
  };
};

export const getPcEndpoint = async (endpoint: string): Promise<{data: PcObject[], included: PcObject[]}> => {
  const url = `https://api.planningcenteronline.com/services/v2/${endpoint}`;
  let response = await sendRequest(url);
  let responseContent = (await response.json()) as PcResult;
  let data = responseContent.data;
  let included = responseContent.included;
  while (responseContent.meta.next) {
    const sep = url.includes("?") ? "&" : "?";
    response = await sendRequest(`${url}${sep}offset=${responseContent.meta.next.offset}`);
    responseContent = (await response.json()) as PcResult;
    data = data.concat(
      responseContent.data
    );
    included = included.concat(responseContent.included);
  }

  return {data, included};
};

const sendRequest = async (url: string): Promise<Response> => {
  const username = process.env.PC_CLIENT_ID;
  const password = process.env.PC_CLIENT_SECRET;
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString(
        "base64"
      )}`,
    },
  });

  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    if (retryAfter) {
      await new Promise((resolve) =>
        setTimeout(resolve, parseInt(retryAfter) * 1000)
      );
      return await sendRequest(url);
    }
    throw new Error("Rate limit exceeded");
  }

  return response;
};
