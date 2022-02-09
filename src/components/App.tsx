import { createUseStyles } from "react-jss";
import { People } from ".";
import { COLORS } from "../style/variables";
import { NavMenu } from "./NavMenu";
import { Plans } from "./Plans";

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
  },
});

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.app}>
      <NavMenu />
      <main className={classes.content}>
        <Plans />
        <People />
      </main>
    </div>
  );
};

export default App;
