import { Spinner } from "components/_basis/Spinner";
import { useSongs } from "hooks/useSongs";
import { createUseStyles } from "react-jss";
import { ISong } from "types";

const useStyles = createUseStyles({
  table: {
    borderCollapse: "collapse",
    width: "100%",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
  },
  link: {
    color: "white",
  },
});

export const SongsWithoutCCLI = () => {
  const { data: songs, loading } = useSongs();
  const songsWithoutCcli = songs.filter((s) => !s.ccliNumber);

  const classes = useStyles();

  const songLink = (songId: string) =>
    `https://planningcenteronline.com/songs/${songId}`;

  const searchLink = (song: ISong) =>
    `https://songselect.ccli.com/search/results?search=${encodeURIComponent(
      song.title
    )}`;

  return (
    <div>
      <h1>Sanger uten CCLI-nummer</h1>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <p>Fant {songsWithoutCcli.length} sanger uten CCLI-nummer</p>
          <table className={classes.table}>
            <thead>
              <tr>
                <th className={classes.th}>Navn</th>
                <th className={classes.th}>CCLI-søk</th>
                <th className={classes.th}>Forfatter</th>
                <th className={classes.th}>Sist brukt</th>
              </tr>
            </thead>
            <tbody>
              {songsWithoutCcli
                .sort(
                  (a, b) =>
                    (b.lastScheduledAt?.getTime() || 0) -
                    (a.lastScheduledAt?.getTime() || 0)
                )
                .map((song) => (
                  <tr key={song.id}>
                    <td className={classes.td}>
                      <a
                        className={classes.link}
                        href={songLink(song.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {song.title}
                      </a>
                    </td>
                    <td className={classes.td}>
                      <a
                        className={classes.link}
                        href={searchLink(song)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Søk
                      </a>
                    </td>
                    <td className={classes.td}>{song.author}</td>
                    <td className={classes.td}>
                      {song.lastScheduledAt?.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
