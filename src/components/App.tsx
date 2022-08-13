import { createUseStyles } from "react-jss";
import { Routes } from "routes";
import { COLORS } from "style/variables";
import { NavMenu } from "components/navigation/NavMenu";
import { PageHeader } from "./navigation/PageHeader";
import { AuthUserContext } from "contexts/AuthUserContext";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { useMediaQuery } from "hooks/useMediaQuery";

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

    "@media (max-width: 900px)": {
      minWidth: "calc(100vw - 40px)",
    },
  },
});

const App = () => {
  const [authUser, setAuthUser] = useState(getAuth().currentUser);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [showNav, setShowNav] = useState(false);

  getAuth().onAuthStateChanged((authUser) => {
    setAuthUser(authUser);
  });

  const toggleNav = () => setShowNav(!showNav);

  const classes = useStyles();
  return (
    <AuthUserContext.Provider value={authUser}>
      <div className={classes.app}>
        <PageHeader toggleNav={toggleNav} />
        <div className={classes.wrapper}>
          {(!isMobile || showNav) && <NavMenu />}
          <main className={classes.content}>
            <Routes />
          </main>
        </div>
      </div>
    </AuthUserContext.Provider>
  );
};

export default App;
