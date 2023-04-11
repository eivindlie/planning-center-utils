import { getToken } from "./auth";

export const get = async (url: string): Promise<any> => {
  let response = await sendRequest(url);
  let responseContent = await response.json();
  const data = responseContent.data as any[];

  while (responseContent.meta.next) {
    const sep = url.includes("?") ? "&" : "?";
    response = await sendRequest(
      `${url}${sep}offset=${responseContent.meta.next.offset}`
    );
    responseContent = await response.json();
    data.push(...responseContent.data);
  }

  return data;
};

const sendRequest = async (
  url: string,
  method: string = "GET"
): Promise<Response> => {
  const response = await fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    if (retryAfter) {
      const delay = +retryAfter * 1.1;
      console.log(`Too many requests, retrying in ${delay} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay * 1000));
      return sendRequest(url, method);
    }
    throw new Error("Too many requests");
  }

  return response;
};
