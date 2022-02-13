import { createUseStyles } from "react-jss";
import { Routes } from "routes";
import { COLORS } from "style/variables";
import { NavMenu } from "components/navigation/NavMenu";
import { PageHeader } from "./navigation/PageHeader";

const useStyles = createUseStyles({
  app: {
    background: COLORS.background,
    color: COLORS.foreground,
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  wrapper: {
    flexGrow: 1,
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
      <PageHeader />
      <div className={classes.wrapper}>
        <NavMenu />
        <main className={classes.content}>
          <Routes />
        </main>
      </div>
    </div>
  );
};

export default App;
