import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  loader: {
    "&, &:after": {
      borderRadius: "50%",
      width: "5em",
      height: "5em",
    },

    margin: "25px",
    fontSize: "10px",
    position: "relative",
    border: "1.1em solid rgba(255, 255, 255, 0.2)",
    borderLeft: "1.1em solid #FFF",
    transform: "translateZ(0)",
    animation: "$load8 1.1s infinite linear",
    color: "rgba(0, 0, 0, 0)",
  },

  "@keyframes load8": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
});

export const Spinner = () => {
  const classes = useStyles();
  return <div className={classes.loader}>Laster...</div>;
};
