import { SimplifiedPlaylist, SpotifyApi } from "@spotify/web-api-ts-sdk";

const spotifySdk = SpotifyApi.withUserAuthorization(
  "d08a4da574ec49cdb5ffdd50602834eb",
  "http://localhost:3000/spotify",
  ["playlist-read-private", "playlist-read-collaborative"]
);

export const getPlaylists = async (): Promise<SimplifiedPlaylist[]> => {
  return (await spotifySdk.currentUser.playlists.playlists(10)).items;
};
