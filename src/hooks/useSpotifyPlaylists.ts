import { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";
import { getAllUsersPlaylists } from "clients/spotifyClient";
import { useState, useEffect } from "react";

export const useSpotifyPlaylists = () => {
  const [playlists, setPlaylists] = useState<SimplifiedPlaylist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllUsersPlaylists()
      .then((playlists) => {
        setPlaylists(playlists);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [setPlaylists]);

  return { data: playlists, loading };
};
