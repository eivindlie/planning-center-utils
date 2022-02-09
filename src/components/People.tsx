import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { getPeople } from "../clients/peopleClient";
import { IPerson } from "../types/contractTypes";

const useStyles = createUseStyles({});

export const People = () => {
  const [people, setPeople] = useState<IPerson[]>([]);

  useEffect(() => {
    getPeople().then((result) => setPeople(result));
  }, []);

  return (
    <ul>
      {people.map((person) => (
        <li>
          {person.attributes.first_name}{" "}
          {person.attributes.middle_name
            ? `${person.attributes.middle_name} `
            : ""}
          {person.attributes.last_name}
        </li>
      ))}
    </ul>
  );
};
