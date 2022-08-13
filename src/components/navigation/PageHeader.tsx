import { getProfile } from "clients/peopleClient";
import { useMediaQuery } from "hooks/useMediaQuery";
import { useEffect } from "react";
import { useState } from "react";
import { createUseStyles } from "react-jss";
import { COLORS } from "style/variables";
import { IPerson } from "types";

const useStyles = createUseStyles({
  header: {
    display: "flex",
    alignItems: "center",
    padding: "15px 25px",
    gap: "10px",
    borderBottom: `2px solid ${COLORS.border}`,
  },
  title: {
    padding: 0,
    margin: 0,
  },
  user: {
    marginLeft: "auto",
  },
  navButton: {
    cursor: "pointer",
    background: "none",
    border: "none",
    color: "white",
    fontSize: "2rem",
  },
});

interface IProps {
  toggleNav: () => void;
}
export const PageHeader = ({ toggleNav }: IProps) => {
  const [profile, setProfile] = useState<IPerson | undefined>();
  const isMobile = useMediaQuery("(max-width: 900px)");

  useEffect(() => {
    const init = async () => {
      setProfile(await getProfile());
    };
    init();
  }, []);

  const classes = useStyles();
  return (
    <header className={classes.header}>
      {isMobile && (
        <button className={classes.navButton} onClick={toggleNav}>
          <i className="las la-bars"></i>
        </button>
      )}
      <h1 className={classes.title}>
        {isMobile ? "" : "Planning Center Utils"}
      </h1>
      <div className={classes.user}>
        {profile?.firstName}{" "}
        {profile?.middleName ? `${profile.middleName} ` : ""}
        {profile?.lastName}
      </div>
    </header>
  );
};
