import { createUseStyles } from "react-jss";
import { COLORS } from "../style/variables";
import { NavElement } from "./NavElement";

const useStyles = createUseStyles({
  nav: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxSizing: "border-box",
    borderRight: `2px solid ${COLORS.border}`,
    padding: "10px",
    gap: "10px",
  },
});

export const NavMenu = () => {
  const classes = useStyles();
  return (
    <nav className={classes.nav}>
      <NavElement href="/teams">Teams</NavElement>
      <NavElement href="/blockout">Blockout</NavElement>
    </nav>
  );
};
