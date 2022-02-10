import { createUseStyles } from "react-jss";
import { PersonPicker } from "./PersonPicker";

const useStyles = createUseStyles({
  teams: {},
});

export const Teams = () => {
  const classes = useStyles();
  return (
    <section className={classes.teams}>
      <PersonPicker />
    </section>
  );
};
