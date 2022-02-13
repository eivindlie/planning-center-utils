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

const formatDate = (date: Date): string => {
  const value = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  console.log(date, value);
  return value;
};

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
      value={formatDate(value)}
      onChange={(e) => onChange?.(new Date(e.currentTarget.value))}
    />
  );
};
