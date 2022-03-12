import { createUseStyles } from "react-jss";
import { COLORS } from "style/variables";
import { NavElement } from "./NavElement";

const useStyles = createUseStyles({
  nav: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxSizing: "border-box",
    borderRight: `2px solid ${COLORS.border}`,
    padding: "25px 15px",
    gap: "25px",
  },
});

export const NavMenu = () => {
  const classes = useStyles();
  return (
    <nav className={classes.nav}>
      <NavElement href="/teams">Teams</NavElement>
      <NavElement href="/blockouts">Blockout</NavElement>
      <NavElement href="/plans">Turnus</NavElement>
    </nav>
  );
};
