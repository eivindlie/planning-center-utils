import { MouseEventHandler, ReactChild } from "react";
import { createUseStyles } from "react-jss";
import { COLORS } from "../../style/variables";

type ButtonType = "primary" | "secondary";
interface IStyleProps {
  type: ButtonType;
}
const useStyles = createUseStyles({
  button: {
    background: (props?: IStyleProps) => {
      switch (props?.type) {
        case "secondary":
          return COLORS.secondary;
        case "primary":
        default:
          return COLORS.primary;
      }
    },
    color: (props?: IStyleProps) => {
      switch (props?.type) {
        case "secondary":
          return COLORS.background;
        case "primary":
        default:
          return COLORS.foreground;
      }
    },
    border: "none",
    padding: "5px 10px",
    outline: "none",
    cursor: "pointer",

    "&:hover": {
      background: (props?: IStyleProps) => {
        switch (props?.type) {
          case "secondary":
            return COLORS.secondaryDark;
          case "primary":
          default:
            return COLORS.primaryDark;
        }
      },
    },

    "&:active": {
      background: (props?: IStyleProps) => {
        switch (props?.type) {
          case "secondary":
            return COLORS.secondaryDarker;
          case "primary":
          default:
            return COLORS.primaryDarker;
        }
      },
    },
  },
});

export interface IProps {
  children: ReactChild;
  onClick: MouseEventHandler<HTMLButtonElement>;
  type?: ButtonType;
}
export const Button = ({ children, type = "primary", onClick }: IProps) => {
  const classes = useStyles({ type });
  return (
    <button className={classes.button} onClick={onClick}>
      {children}
    </button>
  );
};
