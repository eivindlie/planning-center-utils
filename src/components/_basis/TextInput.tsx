import { FormEventHandler, KeyboardEventHandler } from "react";
import { createUseStyles } from "react-jss";
import { COLORS } from "../../style/variables";

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
  value: string;
  onInput?: FormEventHandler<HTMLInputElement>;
  onKeyPress?: KeyboardEventHandler<HTMLInputElement>;
  onChange?: FormEventHandler<HTMLInputElement>;
}
export const TextInput = ({ value, onChange, onInput, onKeyPress }: IProps) => {
  const classes = useStyles();
  return (
    <input
      type="text"
      className={classes.input}
      value={value}
      onInput={onInput}
      onChange={onChange}
      onKeyPress={onKeyPress}
    />
  );
};
