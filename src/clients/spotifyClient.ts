import { SimplifiedPlaylist, SpotifyApi } from "@spotify/web-api-ts-sdk";

const spotifySdk = SpotifyApi.withUserAuthorization(
  "d08a4da574ec49cdb5ffdd50602834eb",
  window.location.origin + "/spotify",
  ["playlist-read-private", "playlist-read-collaborative"]
);

export const getAllUsersPlaylists = async (): Promise<SimplifiedPlaylist[]> => {
  const PAGE_SIZE = 50;
  let response = await spotifySdk.currentUser.playlists.playlists(PAGE_SIZE);
  const result = [...response.items];
  let offset = 0;
  while (response.next) {
    offset += PAGE_SIZE;
    response = await spotifySdk.currentUser.playlists.playlists(
      PAGE_SIZE,
      offset
    );
    result.push(...response.items);
  }
  return result;
};
