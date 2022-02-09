import { useEffect, useState } from "react";
import { getPeople } from "../clients/peopleClient";
import { IPerson } from "../types/contractTypes";

export const People = () => {
  const [people, setPeople] = useState<IPerson[]>([]);

  useEffect(() => {
    getPeople().then((result) => setPeople(result));
  }, []);

  return (
    <ul>
      {people.map((person) => (
        <li key={person.id}>
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
