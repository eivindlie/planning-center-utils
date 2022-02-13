import { ReactChild } from "react";
import { createUseStyles } from "react-jss";
import { Link } from "react-router-dom";
import { COLORS } from "style/variables";

const useStyles = createUseStyles({
  link: {
    padding: "15px 25px",
    border: `1px solid ${COLORS.border}`,
    color: COLORS.foreground,
    textDecoration: "none",
    fontSize: "1.2rem",

    "&:hover": {
      borderColor: COLORS.borderHighlight,
      color: COLORS.foregroundHighlight,
    },
  },
});

export interface IProps {
  children?: ReactChild;
  href: string;
}
export const NavElement = ({ children, href }: IProps) => {
  const classes = useStyles();
  return (
    <Link className={classes.link} to={href}>
      {children}
    </Link>
  );
};
