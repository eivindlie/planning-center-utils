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
  return fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};
