import { MouseEventHandler, ReactChild } from "react";
import { createUseStyles } from "react-jss";
import { COLORS } from "../../style/variables";

const useStyles = createUseStyles({
  button: {
    background: COLORS.primary,
    color: COLORS.foreground,
    border: "none",
    padding: "5px 10px",
    outline: "none",
  },
});

export interface IProps {
  children: ReactChild;
  onClick: MouseEventHandler<HTMLButtonElement>;
}
export const Button = ({ children, onClick }: IProps) => {
  const classes = useStyles();
  return (
    <button className={classes.button} onClick={onClick}>
      {children}
    </button>
  );
};
