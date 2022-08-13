import { MouseEventHandler, ReactChild } from "react";
import { createUseStyles } from "react-jss";
import { COLORS } from "style/variables";

type ButtonType = "primary" | "secondary" | "danger";
interface IStyleProps {
  type: ButtonType;
}
const useStyles = createUseStyles({
  button: {
    background: (props?: IStyleProps) => {
      switch (props?.type) {
        case "secondary":
          return COLORS.secondary;
        case "danger":
          return COLORS.dangerDark;
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
          return COLORS.foregroundLight;
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
          case "danger":
            return COLORS.dangerDark;
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
          case "danger":
            return COLORS.dangerDarker;
          case "primary":
          default:
            return COLORS.primaryDarker;
        }
      },
    },
  },
});

export interface IProps {
  children?: ReactChild;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: ButtonType;
  title?: string;
}
export const Button = ({
  children,
  type = "primary",
  onClick,
  title,
}: IProps) => {
  const classes = useStyles({ type });
  return (
    <button className={classes.button} onClick={onClick} title={title}>
      {children}
    </button>
  );
};
