import { createUseStyles } from "react-jss";
import { COLORS } from "style/variables";

const useStyles = createUseStyles({
  input: {
    background: COLORS.elementBackground,
    border: "none",
    borderBottom: `2px solid ${COLORS.border}`,
    padding: "5px 10px",

    "&:focus": {
      outline: "none",
      borderBottomColor: COLORS.primary,
    },
  },
});

export interface IProps {
  value: Date;
  onChange?: (value: Date) => void;
}
export const DateInput = ({ value, onChange }: IProps) => {
  const classes = useStyles();
  return (
    <input
      type="date"
      className={classes.input}
      value={value.toISOString().split("T")[0]}
      onChange={(e) => onChange?.(new Date(e.currentTarget.value))}
    />
  );
};
