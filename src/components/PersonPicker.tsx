import { useState } from "react";
import { createUseStyles } from "react-jss";
import { Spinner } from ".";
import { searchByName } from "../clients/peopleClient";
import { COLORS } from "../style/variables";
import { IPerson } from "../types";

const useStyles = createUseStyles({
  input: {
    background: "none", // COLORS.elementBackground,
    color: COLORS.foreground,
    border: "none",
    outline: "none",
    borderBottom: `2px solid ${COLORS.border}`,
  },
});

export interface IProps {
  onPersonSelected?: (p: IPerson) => void;
}
export const PersonPicker = ({ onPersonSelected }: IProps) => {
  const [people, setPeople] = useState<IPerson[]>([]);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const classes = useStyles();

  const onKeyDown = async (e: React.KeyboardEvent<HTMLElement>) => {
    if (["Enter", "NumpadEnter"].includes(e.key)) {
      setSearching(true);
      setPeople(await searchByName(query));
      setSearching(false);
    }
  };

  return (
    <div>
      <label htmlFor="person-search">Navn</label>
      <input
        id="person-search"
        type="text"
        className={classes.input}
        onKeyDown={onKeyDown}
        value={query}
        onInput={(e) => setQuery(e.currentTarget.value)}
      />

      {searching && <Spinner />}
      {!searching && (
        <ul>
          {people.map((person) => (
            <li key={person.id}>
              {person.firstName}{" "}
              {person.middleName ? `${person.middleName} ` : ""}
              {person.lastName}
              <button onClick={() => onPersonSelected?.(person)}>Velg</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
