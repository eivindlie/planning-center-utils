import { createUseStyles } from "react-jss";
import { People } from ".";
import { COLORS } from "../style/variables";
import { NavMenu } from "./NavMenu";
import { PersonPicker } from "./PersonPicker";
import { Spinner } from "./Spinner";

const useStyles = createUseStyles({
  app: {
    background: COLORS.background,
    color: COLORS.foreground,
    height: "100vh",
    display: "flex",
  },
  content: {
    flexGrow: 1,
    overflowY: "auto",
    padding: "20px",
  },
});

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.app}>
      <NavMenu />
      <main className={classes.content}>
        <PersonPicker />
      </main>
    </div>
  );
};

export default App;
