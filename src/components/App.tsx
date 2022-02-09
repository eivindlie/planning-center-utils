import { createUseStyles } from "react-jss";
import { People } from ".";
import { COLORS } from "../style/variables";

const useStyles = createUseStyles({
  app: {
    background: COLORS.background,
    color: COLORS.foreground,
    padding: "20px",
    minHeight: "100vh",
  },
});

const App = () => {
  const classes = useStyles();

  return (
    <main className={classes.app}>
      <People />
    </main>
  );
};

export default App;
