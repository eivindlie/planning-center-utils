import { getProfile } from "clients/peopleClient";
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
    borderBottom: `2px solid ${COLORS.border}`,
  },
  title: {
    padding: 0,
    margin: 0,
  },
  user: {
    marginLeft: "auto",
  },
});

export const PageHeader = () => {
  const [profile, setProfile] = useState<IPerson | undefined>();

  useEffect(() => {
    const init = async () => {
      setProfile(await getProfile());
    };
    init();
  }, []);

  const classes = useStyles();
  return (
    <header className={classes.header}>
      <h1 className={classes.title}>Planning Center Utils</h1>
      <div className={classes.user}>
        {profile?.firstName}{" "}
        {profile?.middleName ? `${profile.middleName} ` : ""}
        {profile?.lastName}
      </div>
    </header>
  );
};
