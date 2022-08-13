import { createUseStyles } from "react-jss";
import { Routes } from "routes";
import { COLORS } from "style/variables";
import { NavMenu } from "components/navigation/NavMenu";
import { PageHeader } from "./navigation/PageHeader";
import { AuthUserContext } from "contexts/AuthUserContext";
import { useState } from "react";
import { getAuth, User } from "firebase/auth";

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
  const [authUser, setAuthUser] = useState(getAuth().currentUser);

  getAuth().onAuthStateChanged((authUser) => {
    setAuthUser(authUser);
  });

  const classes = useStyles();

  return (
    <AuthUserContext.Provider value={authUser}>
      <div className={classes.app}>
        <PageHeader />
        <div className={classes.wrapper}>
          <NavMenu />
          <main className={classes.content}>
            <Routes />
          </main>
        </div>
      </div>
    </AuthUserContext.Provider>
  );
};

export default App;
