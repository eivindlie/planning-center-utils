import { useState } from "react";
import { createUseStyles } from "react-jss";
import { Button, Spinner } from "..";
import { searchByName } from "../../clients/peopleClient";
import { IPerson } from "../../types";
import { TextInput } from "../_basis/TextInput";

const useStyles = createUseStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    margin: 0,
    padding: 0,
  },
  listItem: {
    display: "flex",
    gap: "10px",

    "& > *:first-child": {
      width: "200px",
    },
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

  const search = async () => {
    setSearching(true);
    setPeople(await searchByName(query));
    setSearching(false);
  };

  const onKeyDown = async (e: React.KeyboardEvent<HTMLElement>) => {
    if (["Enter", "NumpadEnter"].includes(e.key)) {
      search();
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.searchWrapper}>
        <label htmlFor="person-search">Navn</label>
        <TextInput
          id="person-search"
          onKeyDown={onKeyDown}
          value={query}
          onInput={(e) => {
            setQuery(e.currentTarget.value);
            setPeople([]);
          }}
        />
        <Button onClick={(_) => search()}>Søk</Button>
      </div>

      {searching && <Spinner />}
      {!searching && (
        <ul className={classes.list}>
          {people.map((person) => (
            <li key={person.id} className={classes.listItem}>
              <span>
                {person.firstName}{" "}
                {person.middleName ? `${person.middleName} ` : ""}
                {person.lastName}
              </span>
              <Button onClick={() => onPersonSelected?.(person)}>Velg</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
