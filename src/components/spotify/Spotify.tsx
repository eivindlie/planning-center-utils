import { Spinner } from "components/_basis/Spinner";
import { useSpotifyPlaylists } from "hooks/useSpotifyPlaylists";

export const Spotify = () => {
  const { data: playlists, loading } = useSpotifyPlaylists();
  if (loading) {
    return <Spinner />;
  }

  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  );
};
