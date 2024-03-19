import { getSongs } from "clients/songClient";
import { useEffect, useState } from "react";
import { ISong } from "types";

export const useSongs = (): { data: ISong[]; loading: boolean } => {
  const [songs, setSongs] = useState<ISong[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSongs()
      .then((songs) => {
        setSongs(songs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [setSongs]);

  return { data: songs, loading };
};
